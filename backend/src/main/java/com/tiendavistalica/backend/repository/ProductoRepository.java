package com.tiendavistalica.backend.repository;

import com.tiendavistalica.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEsTemporada(Boolean esTemporada);
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByStockGreaterThan(Integer stock);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByPrecioBetween(Double min, Double max);
}