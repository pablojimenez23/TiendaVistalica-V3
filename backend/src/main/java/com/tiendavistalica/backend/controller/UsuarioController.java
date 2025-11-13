package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Usuario;
import com.tiendavistalica.backend.service.UsuarioService;
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
    
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            nuevoUsuario.setPassword(null);
            return ResponseEntity.ok(nuevoUsuario);
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
            return ResponseEntity.ok(usuario);
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
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerPorEmail(@PathVariable String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
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
    
    @PatchMapping("/{id}/perfil")
    public ResponseEntity<Usuario> actualizarPerfil(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (datos.containsKey("nombre")) usuario.setNombre(datos.get("nombre"));
        if (datos.containsKey("apellido")) usuario.setApellido(datos.get("apellido"));
        if (datos.containsKey("telefono")) usuario.setTelefono(datos.get("telefono"));
        
        Usuario actualizado = usuarioService.actualizar(usuario);
        actualizado.setPassword(null);
        return ResponseEntity.ok(actualizado);
    }
    
    @PatchMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        String passwordActual = datos.get("passwordActual");
        String passwordNueva = datos.get("passwordNueva");
        
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!usuario.getPassword().equals(passwordActual)) {
            return ResponseEntity.badRequest().body("Contraseña actual incorrecta");
        }
        
        usuario.setPassword(passwordNueva);
        usuarioService.actualizar(usuario);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Contraseña actualizada correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        usuarioService.eliminar(id);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Usuario eliminado correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @DeleteMapping("/batch")
    public ResponseEntity<?> eliminarVarios(@RequestBody List<Long> ids) {
        usuarioService.eliminarVarios(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Usuarios eliminados correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}