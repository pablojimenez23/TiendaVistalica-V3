package com.tiendavistalica.backend.repository;

import com.tiendavistalica.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Long usuarioId);
}