package com.tiendavistalica.backend.service;

import com.tiendavistalica.backend.model.Producto;
import com.tiendavistalica.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }
    
    public List<Producto> obtenerTemporada() {
        return productoRepository.findByEsTemporada(true);
    }
    
    public List<Producto> obtenerPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }
    
    public List<Producto> obtenerDisponibles() {
        return productoRepository.findByStockGreaterThan(0);
    }
    
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    public List<Producto> obtenerPorRangoPrecio(Double min, Double max) {
        return productoRepository.findByPrecioBetween(min, max);
    }
    
    public Producto crear(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public List<Producto> crearVarios(List<Producto> productos) {
        return productoRepository.saveAll(productos);
    }
    
    public Producto actualizar(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
    
    public void eliminarVarios(List<Long> ids) {
        productoRepository.deleteAllById(ids);
    }
}