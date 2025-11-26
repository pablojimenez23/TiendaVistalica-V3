package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Rol;
import com.tiendavistalica.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    
    @Autowired
    private RolRepository rolRepository;
    
    @PostMapping
    public ResponseEntity<Rol> crear(@RequestBody Rol rol) {
        Rol nuevo = rolRepository.save(rol);
        return ResponseEntity.ok(nuevo);
    }
    
    @GetMapping
    public List<Rol> obtenerTodos() {
        return rolRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtenerPorId(@PathVariable Long id) {
        Rol rol = rolRepository.findById(id).orElse(null);
        if (rol != null) {
            return ResponseEntity.ok(rol);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizar(@PathVariable Long id, @RequestBody Rol rol) {
        Rol existente = rolRepository.findById(id).orElse(null);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        rol.setId(id);
        return ResponseEntity.ok(rolRepository.save(rol));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!rolRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rolRepository.deleteById(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Rol eliminado");
        return ResponseEntity.ok(respuesta);
    }
}