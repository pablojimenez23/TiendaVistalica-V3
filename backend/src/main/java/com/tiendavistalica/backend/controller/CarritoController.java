package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.CarritoItem;
import com.tiendavistalica.backend.model.Producto;
import com.tiendavistalica.backend.model.Usuario;
import com.tiendavistalica.backend.repository.CarritoItemRepository;
import com.tiendavistalica.backend.repository.ProductoRepository;
import com.tiendavistalica.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {
    
    @Autowired
    private CarritoItemRepository carritoItemRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @PostMapping("/agregar")
    public ResponseEntity<CarritoItem> agregarProducto(@RequestBody Map<String, Long> request) {
        Long usuarioId = request.get("usuarioId");
        Long productoId = request.get("productoId");
        
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Producto producto = productoRepository.findById(productoId).orElse(null);
        
        if (usuario == null || producto == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<CarritoItem> itemExistente = carritoItemRepository
            .findByUsuarioIdAndProductoId(usuarioId, productoId);
        
        if (itemExistente.isPresent()) {
            CarritoItem item = itemExistente.get();
            item.setCantidad(item.getCantidad() + 1);
            return ResponseEntity.ok(carritoItemRepository.save(item));
        } else {
            CarritoItem nuevoItem = new CarritoItem();
            nuevoItem.setUsuario(usuario);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(1);
            return ResponseEntity.ok(carritoItemRepository.save(nuevoItem));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public List<CarritoItem> obtenerCarrito(@PathVariable Long usuarioId) {
        return carritoItemRepository.findByUsuarioId(usuarioId);
    }
    
    @GetMapping
    public List<CarritoItem> obtenerTodos() {
        return carritoItemRepository.findAll();
    }
    
    @GetMapping("/item/{id}")
    public ResponseEntity<CarritoItem> obtenerItemPorId(@PathVariable Long id) {
        CarritoItem item = carritoItemRepository.findById(id).orElse(null);
        if (item != null) {
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/item/{id}")
    public ResponseEntity<CarritoItem> actualizarCantidad(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        Integer cantidad = request.get("cantidad");
        CarritoItem item = carritoItemRepository.findById(id).orElse(null);
        
        if (item != null && cantidad > 0) {
            item.setCantidad(cantidad);
            return ResponseEntity.ok(carritoItemRepository.save(item));
        }
        return ResponseEntity.badRequest().build();
    }
    
    @DeleteMapping("/item/{id}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long id) {
        CarritoItem item = carritoItemRepository.findById(id).orElse(null);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        
        carritoItemRepository.deleteById(id);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Item eliminado del carrito");
        return ResponseEntity.ok(respuesta);
    }
    

    @DeleteMapping("/usuario/{usuarioId}")
    @Transactional
    public ResponseEntity<?> vaciarCarrito(@PathVariable Long usuarioId) {
        carritoItemRepository.deleteByUsuarioId(usuarioId);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Carrito vaciado correctamente");
        return ResponseEntity.ok(respuesta);
    }
}