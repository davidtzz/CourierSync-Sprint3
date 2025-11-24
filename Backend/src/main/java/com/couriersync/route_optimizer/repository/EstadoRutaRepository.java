package com.couriersync.route_optimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.couriersync.route_optimizer.entity.EstadoRuta;

public interface EstadoRutaRepository extends JpaRepository<EstadoRuta, Integer> {
    EstadoRuta findByNombreEstado(String nombreEstado);
}

