package com.tiendavistalica.backend.service;

import com.tiendavistalica.backend.model.Usuario;
import com.tiendavistalica.backend.model.Rol;
import com.tiendavistalica.backend.repository.UsuarioRepository;
import com.tiendavistalica.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;
    
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        if (usuario.getRol() == null) {
            Rol rolCliente = rolRepository.findByNombre("CLIENTE").orElse(null);
            if (rolCliente != null) {
                usuario.setRol(rolCliente);
            }
        }
        
        return usuarioRepository.save(usuario);
    }
    
    public Usuario login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario != null && usuario.getPassword().equals(password)) {
            return usuario;
        }
        return null;
    }
    
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }
    
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }
    
    @Transactional
    public Usuario actualizar(Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(usuarioActualizado.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (usuarioActualizado.getNombre() != null && !usuarioActualizado.getNombre().trim().isEmpty()) {
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
        }
        
        if (usuarioActualizado.getApellido() != null && !usuarioActualizado.getApellido().trim().isEmpty()) {
            usuarioExistente.setApellido(usuarioActualizado.getApellido());
        }
        
        if (usuarioActualizado.getEmail() != null && !usuarioActualizado.getEmail().trim().isEmpty()) {

            if (!usuarioActualizado.getEmail().equals(usuarioExistente.getEmail())) {
                if (usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
                    throw new RuntimeException("El email ya está registrado");
                }
            }
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
        }
        
        if (usuarioActualizado.getGenero() != null && !usuarioActualizado.getGenero().trim().isEmpty()) {
            usuarioExistente.setGenero(usuarioActualizado.getGenero());
        }
        
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().trim().isEmpty()) {
            usuarioExistente.setPassword(usuarioActualizado.getPassword());
        }

        if (usuarioActualizado.getRol() != null) {
            usuarioExistente.setRol(usuarioActualizado.getRol());
        }
        
        return usuarioRepository.save(usuarioExistente);
    }
    
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
    
    public void eliminarVarios(List<Long> ids) {
        usuarioRepository.deleteAllById(ids);
    }
}