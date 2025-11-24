package com.couriersync.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.couriersync.dto.UsuarioLoginDTO;
import com.couriersync.dto.UsuarioRegistroDTO;
import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import com.couriersync.service.AuthService;
import com.couriersync.service.JwtService;
import com.couriersync.service.SignUpService;

import jakarta.validation.Valid;


@RestController
@CrossOrigin(origins = "http://localhost:8080", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH}, allowedHeaders = "*", allowCredentials = "true")
public class AuthController {
    private static final String MESSAGE_KEY = "message";
    private static final String CEDULA_KEY = "cedula";
    private final AuthService authService;
    private final SignUpService signUpService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, UsuarioRepository usuarioRepository, SignUpService signUpService, JwtService jwtService) {
        this.authService = authService;
        this.signUpService = signUpService;
        this.jwtService = jwtService;
    }

    @GetMapping("/user")
    public Usuario getMethodName(@RequestParam String cedula) {
        return authService.findByCedula(cedula);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody UsuarioLoginDTO usuarioLoginDTO) {
        boolean success = authService.authenticate(usuarioLoginDTO.getUsername(),
            usuarioLoginDTO.getContraseña(),
            usuarioLoginDTO.getRol());
       
        if (!success) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Obtener información del usuario
        Usuario usuario = authService.findByUsuario(usuarioLoginDTO.getUsername());
    
        System.out.println("Usuario: " + usuario);
        // Verificar si el usuario tiene MFA habilitado
        if (usuario.isMfaEnabled()) {
            return ResponseEntity.ok(Map.of(
                MESSAGE_KEY, "Se requiere verificación MFA",
                "requiresMfa", true,
                CEDULA_KEY, usuario.getCedula()
            ));
        }

        // Generar JWT token
        String token = jwtService.generateToken(
            usuario.getCedula(),
            usuario.getUsuario(),
            usuario.getRol()
        );

        return ResponseEntity.ok(Map.of(
            "token", token,
            MESSAGE_KEY, "Login exitoso",
            CEDULA_KEY, usuario.getCedula(),
            "rol", usuario.getRol()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrarUsuario(@Valid @RequestBody UsuarioRegistroDTO usuarioDTO) {
        try {
            signUpService.registrarUsuario(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado con éxito");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: datos duplicados o inválidos");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error inesperado. Intente más tarde.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body("Token de autorización requerido");
        }

        try {
            String token = authHeader.substring(7); // Remover "Bearer "
            
            // Validar el token
            String cedula = jwtService.extractCedula(token);
            if (!jwtService.validateToken(token, cedula)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                   .body("Token inválido");
            }

            // En un sistema más robusto, aquí agregarías el token a una blacklist
            // Por ahora, simplemente confirmamos que el logout fue exitoso
            return ResponseEntity.ok(Map.of(
                MESSAGE_KEY, "Logout exitoso",
                CEDULA_KEY, cedula
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body("Token inválido o expirado");
        }
    }
}
