package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Producto;
import com.tiendavistalica.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    //solo admin - Crear producto
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto nuevo = productoService.crear(producto);
        return ResponseEntity.ok(nuevo);
    }
    
    //solo admin  - Crear varios productos
    @PostMapping("/batch")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Producto>> crearVarios(@RequestBody List<Producto> productos) {
        List<Producto> creados = productoService.crearVarios(productos);
        return ResponseEntity.ok(creados);
    }
    
    //Publico - Ver todos los productos
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }
    
    //Publico - Ver un producto
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }
    
    //Publico - Ver productos de temporada
    @GetMapping("/temporada")
    public List<Producto> obtenerTemporada() {
        return productoService.obtenerTemporada();
    }
    
    //Publico - Ver productos por categoría
    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return productoService.obtenerPorCategoria(categoriaId);
    }
    
    //Publico  - Ver productos disponibles
    @GetMapping("/disponibles")
    public List<Producto> obtenerDisponibles() {
        return productoService.obtenerDisponibles();
    }
    
    //Publico  - Buscar productos
    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }
    
    //Publico  - Buscar por rango de precio
    @GetMapping("/precio")
    public List<Producto> obtenerPorRangoPrecio(@RequestParam Double min, @RequestParam Double max) {
        return productoService.obtenerPorRangoPrecio(min, max);
    }
    
    //Solo Admin - Actualizar producto completo
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        Producto existente = productoService.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        producto.setId(id);
        Producto actualizado = productoService.actualizar(producto);
        return ResponseEntity.ok(actualizado);
    }
    
    //Solo Admin - Actualizar solo el stock
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    
    //Solo Admin - Actualizar solo el precio
    @PatchMapping("/{id}/precio")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    
    //Solo Admin - Marcar como temporada
    @PatchMapping("/{id}/temporada")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    
    //Solo Admin - Eliminar producto
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    
    //Solo Admin - Eliminar varios productos
    @DeleteMapping("/batch")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarVarios(@RequestBody List<Long> ids) {
        productoService.eliminarVarios(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Productos eliminados correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}