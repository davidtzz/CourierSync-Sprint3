package com.couriersync.users.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tbl_roles")
@Data
public class Rol {
    
    @Id
    @Column(name = "id_rol")
    private Integer idRol;
    
    @Column(name = "nombre_rol", nullable = false, unique = true)
    private String nombreRol;
    
}