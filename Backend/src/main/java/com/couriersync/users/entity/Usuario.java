package com.couriersync.users.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tbl_usuarios")
@Data
public class Usuario {

    @Id
    private String cedula;

    @Column(name = "usuario", nullable = false)
    private String usuario;

    @Column(name = "nombres", nullable = false, unique = true)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellido;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "celular", nullable = false, unique = true)
    private String celular;

    
    @Column(name = "contraseña", nullable = false)
    @JsonIgnore
    private String contraseña;

    @Column(name = "rol", nullable = false)
    private int rol;

    @Column(name = "mfa_active", nullable = false) private boolean mfaEnabled; // ¿El usuario tiene MFA activo?
    
    @Column(name = "mfa_secreto", length = 128)
    @JsonIgnore
    private String mfaSecret;       // Clave secreta cifrada para TOTP

    // Getters y Setters generados por Lombok
}
