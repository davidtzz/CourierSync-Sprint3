package com.couriersync.route_optimizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tbl_trafico_promedio")
@Data

public class TipoTrafico {

    @Id
    @Column(name = "id_trafico", nullable = false, unique = true)
    private Integer idTrafico;

    @Column(name = "nivel_trafico", nullable = false, unique = true)
    private String nivelTrafico;


    @Column(name = "descripcion", length = 25)
    private String descripcion;

    // Getters y Setters generados por Lombok
}
