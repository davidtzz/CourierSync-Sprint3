package com.couriersync.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.couriersync.users.dto.MfaRequest;
import com.couriersync.users.entity.Usuario;
import com.couriersync.users.service.AuthService;
import com.couriersync.users.service.JwtService;
import com.couriersync.users.service.MfaService;

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
    public ResponseEntity<?> generateSecret(@RequestBody Map<String, String> request) {
        String cedula = request.get("cedula");
        
        try {
            Usuario usuario = authService.findByCedula(cedula);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Usuario no encontrado");
            }
            
            String secret = mfaService.generateSecret();
            
            // Logging temporal para debugging
            System.out.println("=== MFA SECRET GENERATION ===");
            System.out.println("Secret generado: " + secret);
            System.out.println("Secret length: " + secret.length());
            
            usuario.setMfaSecret(secret);
            usuario.setMfaEnabled(true);
            authService.saveUsuario(usuario);
            
            // Verificar que se guardó correctamente
            Usuario usuarioVerificado = authService.findByCedula(cedula);
            if (usuarioVerificado != null) {
                System.out.println("Secret guardado en BD: " + usuarioVerificado.getMfaSecret());
                System.out.println("Secret guardado length: " + (usuarioVerificado.getMfaSecret() != null ? usuarioVerificado.getMfaSecret().length() : 0));
                System.out.println("¿Coinciden?: " + secret.equals(usuarioVerificado.getMfaSecret()));
            }
            System.out.println("=============================");
            
            return ResponseEntity.ok(Map.of("secret", secret, "message", "MFA configurado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error al configurar MFA");
        }
    }

    @GetMapping("/test-code/{cedula}")
    public ResponseEntity<?> testCode(@PathVariable String cedula) {
        try {
            Usuario usuario = authService.findByCedula(cedula);
            if (usuario == null || usuario.getMfaSecret() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Usuario no encontrado o sin MFA configurado");
            }
            
            // Generar código de prueba con el secret actual
            long currentTime = System.currentTimeMillis() / 1000;
            String testCode = mfaService.generateTestCode(usuario.getMfaSecret());
            
            return ResponseEntity.ok(Map.of(
                "secret", usuario.getMfaSecret(),
                "testCode", testCode,
                "currentTime", currentTime,
                "message", "Este es el código que DEBERÍA mostrar Authy ahora mismo"
            ));
        } catch (dev.samstevens.totp.exceptions.CodeGenerationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al generar código: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
public ResponseEntity<?> verifyMfa(@RequestBody MfaRequest request) {
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

        // Logging detallado del secret que se va a usar
        System.out.println("=== SECRET RECUPERADO DE BD ===");
        System.out.println("Secret completo: " + usuario.getMfaSecret());
        System.out.println("Secret length: " + (usuario.getMfaSecret() != null ? usuario.getMfaSecret().length() : 0));
        System.out.println("Secret bytes: " + java.util.Arrays.toString(usuario.getMfaSecret().getBytes()));
        System.out.println("===============================");
        
        // Generar código de prueba para comparar
        try {
            String testCode = mfaService.generateTestCode(usuario.getMfaSecret());
            System.out.println("\n🔍 CÓDIGO QUE DEBERÍA SER AHORA: " + testCode);
            System.out.println("CÓDIGO QUE INGRESASTE: " + request.getCode());
            System.out.println("¿Coinciden? " + testCode.equals(request.getCode()));
            System.out.println("⚠️ Si NO coinciden, el secret en Authy es DIFERENTE al de la BD\n");
        } catch (dev.samstevens.totp.exceptions.CodeGenerationException e) {
            System.err.println("Error generando código de prueba: " + e.getMessage());
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
        System.err.println("Error en verificación MFA: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error interno del servidor");
    }
    }
}