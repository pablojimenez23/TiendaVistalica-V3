package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Producto;
import com.tiendavistalica.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto nuevo = productoService.crear(producto);
        return ResponseEntity.ok(nuevo);
    }
    
    @PostMapping("/batch")
    public ResponseEntity<List<Producto>> crearVarios(@RequestBody List<Producto> productos) {
        List<Producto> creados = productoService.crearVarios(productos);
        return ResponseEntity.ok(creados);
    }
    
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/temporada")
    public List<Producto> obtenerTemporada() {
        return productoService.obtenerTemporada();
    }
    
    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return productoService.obtenerPorCategoria(categoriaId);
    }
    
    @GetMapping("/disponibles")
    public List<Producto> obtenerDisponibles() {
        return productoService.obtenerDisponibles();
    }
    
    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }
    
    @GetMapping("/precio")
    public List<Producto> obtenerPorRangoPrecio(@RequestParam Double min, @RequestParam Double max) {
        return productoService.obtenerPorRangoPrecio(min, max);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        Producto existente = productoService.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        producto.setId(id);
        Producto actualizado = productoService.actualizar(producto);
        return ResponseEntity.ok(actualizado);
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> actualizarStock(@PathVariable Long id, @RequestBody Map<String, Integer> datos) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        
        Integer nuevoStock = datos.get("stock");
        producto.setStock(nuevoStock);
        Producto actualizado = productoService.actualizar(producto);
        return ResponseEntity.ok(actualizado);
    }
    
    @PatchMapping("/{id}/precio")
    public ResponseEntity<Producto> actualizarPrecio(@PathVariable Long id, @RequestBody Map<String, Double> datos) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        
        Double nuevoPrecio = datos.get("precio");
        producto.setPrecio(nuevoPrecio);
        Producto actualizado = productoService.actualizar(producto);
        return ResponseEntity.ok(actualizado);
    }
    
    @PatchMapping("/{id}/temporada")
    public ResponseEntity<Producto> marcarTemporada(@PathVariable Long id, @RequestBody Map<String, Boolean> datos) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        
        Boolean esTemporada = datos.get("esTemporada");
        producto.setEsTemporada(esTemporada);
        Producto actualizado = productoService.actualizar(producto);
        return ResponseEntity.ok(actualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        
        productoService.eliminar(id);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Producto eliminado correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @DeleteMapping("/batch")
    public ResponseEntity<?> eliminarVarios(@RequestBody List<Long> ids) {
        productoService.eliminarVarios(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Productos eliminados correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}