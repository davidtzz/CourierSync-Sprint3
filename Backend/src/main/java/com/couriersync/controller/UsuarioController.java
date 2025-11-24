package com.couriersync.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.couriersync.service.JwtService;
import com.couriersync.service.UsuarioService;

@RestController
@RequestMapping("/users")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @PatchMapping("/{cedula}/rol")
    public ResponseEntity<Object> cambiarRol(
        @PathVariable String cedula,
        @RequestBody Map<String, Integer> body,
        @RequestHeader("Authorization") String tokenHeader
    ) {
        try {
            String token = tokenHeader.replace("Bearer ", "").trim();

            String cedulaAuth = jwtService.extractCedula(token);
            Integer rolAuth = jwtService.extractRol(token);

            if (rolAuth == null || (rolAuth != 1 && rolAuth != 2)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No tiene permisos para cambiar roles.");
            }

            if (cedulaAuth.equals(cedula)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No puede modificar su propio rol.");
            }

            Integer nuevoRol = body.get("nuevoRol");
            if (nuevoRol == null || nuevoRol < 1 || nuevoRol > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Rol inválido. Debe ser 1 (Admin), 2 (Gestor de rutas) o 3 (Conductor).");
            }

            usuarioService.cambiarRolDesdeToken(token, cedula, nuevoRol);

            return ResponseEntity.ok("Rol actualizado correctamente para el usuario " + cedula);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error inesperado: " + e.getMessage());
        }
    }
}
