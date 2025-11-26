package com.tiendavistalica.backend.controller;

import com.tiendavistalica.backend.model.Pedido;
import com.tiendavistalica.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    // AUTENTICADO - Crear pedido
    @PostMapping
    public ResponseEntity<Pedido> crear(@RequestBody Pedido pedido) {
        Pedido nuevo = pedidoService.crear(pedido);
        return ResponseEntity.ok(nuevo);
    }
    
    // SOLO ADMINISTRADOR - Ver todos los pedidos
    @GetMapping("/todos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        List<Pedido> pedidos = pedidoService.obtenerTodos();
        return ResponseEntity.ok(pedidos);
    }
    
    // AUTENTICADO - Ver pedidos propios (el frontend debe enviar el ID del usuario autenticado)
    @GetMapping
    public List<Pedido> obtenerPedidosDelUsuario() {
        // Este endpoint debería obtener el usuario del contexto de seguridad
        // Por ahora, lo dejamos genérico
        return pedidoService.obtenerTodos();
    }
    
    // AUTENTICADO - Ver pedidos por usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return pedidoService.obtenerPorUsuario(usuarioId);
    }
    
    // AUTENTICADO - Ver un pedido específico
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        }
        return ResponseEntity.notFound().build();
    }
    
    // SOLO ADMINISTRADOR - Ver pedidos por estado
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<Pedido> obtenerPorEstado(@PathVariable String estado) {
        return pedidoService.obtenerPorEstado(estado);
    }
    
    // SOLO ADMINISTRADOR - Aprobar pedido
    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> aprobarPedido(@PathVariable Long id) {
        try {
            Pedido pedido = pedidoService.obtenerPorId(id);
            if (pedido == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Pedido no encontrado");
                return ResponseEntity.status(404).body(error);
            }
            
            if (!"PENDIENTE".equals(pedido.getEstado())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Solo se pueden aprobar pedidos pendientes");
                return ResponseEntity.badRequest().body(error);
            }
            
            Pedido actualizado = pedidoService.actualizarEstado(id, "APROBADO");
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al aprobar el pedido: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    // SOLO ADMINISTRADOR - Cancelar pedido con motivo
    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        try {
            Pedido pedido = pedidoService.obtenerPorId(id);
            if (pedido == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Pedido no encontrado");
                return ResponseEntity.status(404).body(error);
            }
            
            if ("CANCELADO".equals(pedido.getEstado())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El pedido ya está cancelado");
                return ResponseEntity.badRequest().body(error);
            }
            
            String motivo = datos.get("motivo");
            if (motivo == null || motivo.trim().isEmpty()) {
                motivo = "Sin motivo especificado";
            }
            
            Pedido actualizado = pedidoService.cancelarPedido(id, motivo);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al cancelar el pedido: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    // SOLO ADMINISTRADOR - Actualizar estado
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        String nuevoEstado = datos.get("estado");
        Pedido actualizado = pedidoService.actualizarEstado(id, nuevoEstado);
        if (actualizado != null) {
            return ResponseEntity.ok(actualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    // AUTENTICADO - Actualizar dirección (solo si está pendiente)
    @PatchMapping("/{id}/direccion")
    public ResponseEntity<Pedido> actualizarDireccion(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!"PENDIENTE".equals(pedido.getEstado())) {
            return ResponseEntity.badRequest().build();
        }
        
        String nuevaDireccion = datos.get("direccionEnvio");
        pedido.setDireccionEnvio(nuevaDireccion);
        Pedido actualizado = pedidoService.actualizar(pedido);
        return ResponseEntity.ok(actualizado);
    }
    
    // SOLO ADMINISTRADOR - Actualizar pedido completo
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Pedido> actualizar(@PathVariable Long id, @RequestBody Pedido pedido) {
        Pedido existente = pedidoService.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        pedido.setId(id);
        Pedido actualizado = pedidoService.actualizar(pedido);
        return ResponseEntity.ok(actualizado);
    }
    
    // SOLO ADMINISTRADOR - Eliminar pedido
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    
    // SOLO ADMINISTRADOR - Eliminar varios pedidos
    @DeleteMapping("/batch")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarVarios(@RequestBody List<Long> ids) {
        pedidoService.eliminarVarios(ids);
        
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Pedidos eliminados correctamente");
        respuesta.put("cantidad", String.valueOf(ids.size()));
        return ResponseEntity.ok(respuesta);
    }
}