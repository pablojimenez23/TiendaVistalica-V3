package com.tiendavistalica.backend.service;

import com.tiendavistalica.backend.model.Pedido;
import com.tiendavistalica.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    public Pedido crear(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }
    
    public List<Pedido> obtenerPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId);
    }
    
    public Pedido obtenerPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }
    
    public List<Pedido> obtenerPorEstado(String estado) {
        return pedidoRepository.findByEstado(estado);
    }
    
    public Pedido actualizar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    @Transactional
    public Pedido actualizarEstado(Long id, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido != null) {
            pedido.setEstado(nuevoEstado);
            return pedidoRepository.save(pedido);
        }
        return null;
    }
    
    @Transactional
    public Pedido cancelarPedido(Long id, String motivo) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setEstado("CANCELADO");
        pedido.setMotivoCancelacion(motivo);
        
        return pedidoRepository.save(pedido);
    }
    
    public void eliminar(Long id) {
        pedidoRepository.deleteById(id);
    }
    
    public void eliminarVarios(List<Long> ids) {
        pedidoRepository.deleteAllById(ids);
    }
}