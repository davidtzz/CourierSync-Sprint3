package com.couriersync.route_optimizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tbl_estado_ruta")
@Data
public class EstadoRuta {

    @Id
    @Column(name = "id_estado", nullable = false)
    private Integer idEstado;

    @Column(name = "nombre_estado", nullable = false, length = 50)
    private String nombreEstado;

    // Getters y Setters generados por Lombok
}

