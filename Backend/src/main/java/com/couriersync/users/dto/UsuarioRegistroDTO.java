package com.couriersync.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRegistroDTO {

    @NotBlank
    private String usuario;
    @NotBlank
    private String cedula;
    @NotBlank
    private String nombre;
    @NotBlank
    private String apellido;
    @NotBlank
    private String email;
    @NotBlank
    private String celular;
    @NotBlank
    private String contraseña;
    @NotBlank
    private String confirmarContraseña;
    @NotNull
    private int rol;
    // Getters y Setters generados por Lombok
}
