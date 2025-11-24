package com.couriersync.route_optimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.couriersync.route_optimizer.entity.Ruta;

public interface RutaRepository extends JpaRepository<Ruta, Integer> {
    Ruta findByIdRuta(Integer idRuta);
}

