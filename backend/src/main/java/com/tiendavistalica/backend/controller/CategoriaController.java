package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Categoria;
import com.tiendavistalica.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria nueva = categoriaRepository.save(categoria);
        return ResponseEntity.ok(nueva);
    }
    
    @PostMapping("/batch")
    public ResponseEntity<List<Categoria>> crearVarias(@RequestBody List<Categoria> categorias) {
        List<Categoria> creadas = categoriaRepository.saveAll(categorias);
        return ResponseEntity.ok(creadas);
    }
    
    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }
    
    @GetMapping("/activas")
    public List<Categoria> obtenerActivas() {
        return categoriaRepository.findByActivoTrue();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
        Categoria existente = categoriaRepository.findById(id).orElse(null);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        categoria.setId(id);
        Categoria actualizada = categoriaRepository.save(categoria);
        return ResponseEntity.ok(actualizada);
    }
    
    @PatchMapping("/{id}/activo")
    public ResponseEntity<Categoria> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> datos) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        if (categoria == null) {
            return ResponseEntity.notFound().build();
        }
        
        Boolean activo = datos.get("activo");
        categoria.setActivo(activo);
        Categoria actualizada = categoriaRepository.save(categoria);
        return ResponseEntity.ok(actualizada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        if (categoria == null) {
            return ResponseEntity.notFound().build();
        }
        
        categoriaRepository.deleteById(id);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Categoría eliminada correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @DeleteMapping("/batch")
    public ResponseEntity<?> eliminarVarias(@RequestBody List<Long> ids) {
        categoriaRepository.deleteAllById(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Categorías eliminadas correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}