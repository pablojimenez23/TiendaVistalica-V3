package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Pedido;
import com.tiendavistalica.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @PostMapping
    public ResponseEntity<Pedido> crear(@RequestBody Pedido pedido) {
        Pedido nuevo = pedidoService.crear(pedido);
        return ResponseEntity.ok(nuevo);
    }
    
    @GetMapping
    public List<Pedido> obtenerTodos() {
        return pedidoService.obtenerTodos();
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return pedidoService.obtenerPorUsuario(usuarioId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/estado/{estado}")
    public List<Pedido> obtenerPorEstado(@PathVariable String estado) {
        return pedidoService.obtenerPorEstado(estado);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizar(@PathVariable Long id, @RequestBody Pedido pedido) {
        Pedido existente = pedidoService.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        pedido.setId(id);
        Pedido actualizado = pedidoService.actualizar(pedido);
        return ResponseEntity.ok(actualizado);
    }
    
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        String nuevoEstado = datos.get("estado");
        Pedido actualizado = pedidoService.actualizarEstado(id, nuevoEstado);
        if (actualizado != null) {
            return ResponseEntity.ok(actualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PatchMapping("/{id}/direccion")
    public ResponseEntity<Pedido> actualizarDireccion(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        
        String nuevaDireccion = datos.get("direccionEnvio");
        pedido.setDireccionEnvio(nuevaDireccion);
        Pedido actualizado = pedidoService.actualizar(pedido);
        return ResponseEntity.ok(actualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        
        pedidoService.eliminar(id);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Pedido eliminado correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @DeleteMapping("/batch")
    public ResponseEntity<?> eliminarVarios(@RequestBody List<Long> ids) {
        pedidoService.eliminarVarios(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Pedidos eliminados correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}