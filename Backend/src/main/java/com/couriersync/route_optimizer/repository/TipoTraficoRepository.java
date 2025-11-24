package com.couriersync.route_optimizer.repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.couriersync.route_optimizer.entity.TipoTrafico;

public interface TipoTraficoRepository extends JpaRepository<TipoTrafico, Integer> {

    TipoTrafico findByNivelTrafico(String nivelTrafico);
    List<TipoTrafico> findAllByOrderByNivelTraficoAsc();
}
