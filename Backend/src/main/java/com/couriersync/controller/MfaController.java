package com.couriersync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.couriersync.entity.Usuario;
import com.couriersync.service.MfaService;
import com.couriersync.service.AuthService;
import com.couriersync.service.JwtService;
import com.couriersync.dto.MfaRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/mfa")
public class MfaController {

    private final MfaService mfaService;
    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    public MfaController(MfaService mfaService, AuthService authService, JwtService jwtService) {
        this.mfaService = mfaService;
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/generate-secret")
    public ResponseEntity<Object> generateSecret(@RequestBody Map<String, String> request) {
        String cedula = request.get("cedula");
        
        try {
            Usuario usuario = authService.findByCedula(cedula);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Usuario no encontrado");
            }
            
            String secret = mfaService.generateSecret();
            usuario.setMfaSecret(secret);
            usuario.setMfaEnabled(true);
            authService.saveUsuario(usuario);
            
            return ResponseEntity.ok(Map.of("secret", secret, "message", "MFA configurado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error al configurar MFA");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Object> verifyMfa(@RequestBody MfaRequest request) {
        try {
            Usuario usuario = authService.findByCedula(request.getCedula());
            
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Usuario no encontrado");
            }

            if (usuario.getMfaSecret() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body("Usuario no tiene MFA configurado");
            }

            if (mfaService.verifyCode(usuario.getMfaSecret(), request.getCode())) {
                // Generar JWT token real
                String token = jwtService.generateToken(
                    usuario.getCedula(),
                    usuario.getUsuario(),
                    usuario.getRol()
                );
                
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "message", "MFA verificado exitosamente",
                    "cedula", usuario.getCedula(),
                    "rol", usuario.getRol()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                     .body("Código TOTP inválido");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error interno del servidor");
        }
    }
}
