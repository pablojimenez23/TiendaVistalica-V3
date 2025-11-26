package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Usuario;
import com.tiendavistalica.backend.service.UsuarioService;
import com.tiendavistalica.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            nuevoUsuario.setPassword(null);
            
            String rolNombre = nuevoUsuario.getRol() != null ? nuevoUsuario.getRol().getNombre() : "CLIENTE";
            String token = jwtUtil.generateToken(
                nuevoUsuario.getId(),
                nuevoUsuario.getEmail(),
                rolNombre
            );
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuario", nuevoUsuario);
            respuesta.put("token", token);
            
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Usuario usuario = usuarioService.login(email, password);
        
        if (usuario != null) {
            usuario.setPassword(null);
            
            String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
            String token = jwtUtil.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                rolNombre
            );
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuario", usuario); 
            respuesta.put("token", token);
            
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }
    
    @GetMapping
    public List<Usuario> obtenerTodos() {
        List<Usuario> usuarios = usuarioService.obtenerTodos();
        usuarios.forEach(u -> u.setPassword(null));
        return usuarios;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario != null) {
            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario usuarioExistente = usuarioService.buscarPorId(id);
        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setId(id);
        Usuario actualizado = usuarioService.actualizar(usuario);
        actualizado.setPassword(null);
        return ResponseEntity.ok(actualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (usuarioService.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.eliminar(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Usuario eliminado");
        return ResponseEntity.ok(respuesta);
    }
}