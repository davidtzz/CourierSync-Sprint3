package com.couriersync.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioLoginDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contraseña;

    @NotNull(message = "El rol es obligatorio")
    private Integer rol;

    // Getters y Setters generados por Lombok
}