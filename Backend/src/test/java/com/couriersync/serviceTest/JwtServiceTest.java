package com.couriersync.serviceTest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.couriersync.service.JwtService;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        // Arrange - Configurar valores simulados para las propiedades @Value
        ReflectionTestUtils.setField(jwtService, "secretKey", "EstaEsUnaLlaveDePruebaSeguraParaJWT12345");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1000 * 60 * 60); // 1 hora
    }

    @Test
    void generateToken_devuelveTokenValido() {
        // Arrange
        String cedula = "12345";
        String username = "juan";
        int rol = 1;

        // Act
        String token = jwtService.generateToken(cedula, username, rol);

        // Assert
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3, "El token debe tener tres partes (header, payload, signature)");
    }

    @Test
    void extractCedula_devuelveValorCorrecto() {
        // Arrange
        String token = jwtService.generateToken("98765", "maria", 2);

        // Act
        String cedulaExtraida = jwtService.extractCedula(token);

        // Assert
        assertEquals("98765", cedulaExtraida);
    }

    @Test
    void extractUsernameYRol_devuelvenValoresCorrectos() {
        // Arrange
        String token = jwtService.generateToken("321", "carlos", 3);

        // Act
        String username = jwtService.extractUsername(token);
        Integer rol = jwtService.extractRol(token);

        // Assert
        assertEquals("carlos", username);
        assertEquals(3, rol);
    }

    @Test
    void validateToken_TokenValido_devuelveTrue() {
        // Arrange
        String cedula = "555";
        String token = jwtService.generateToken(cedula, "ana", 2);

        // Act
        Boolean valido = jwtService.validateToken(token, cedula);

        // Assert
        assertTrue(valido);
    }

    @Test
    void validateToken_CedulaDistinta_devuelveFalse() {
        // Arrange
        String token = jwtService.generateToken("999", "pedro", 1);

        // Act
        Boolean valido = jwtService.validateToken(token, "otraCedula");

        // Assert
        assertFalse(valido);
    }

    @Test
    void isTokenExpired_conTokenExpirado_devuelveTrue() throws InterruptedException {
        // Arrange
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1); // expira casi de inmediato
        String token = jwtService.generateToken("123", "test", 1);

        // Esperar a que expire
        Thread.sleep(5);

        // Act & Assert
        // Cuando un token está expirado, cualquier intento de acceder a sus claims lanza ExpiredJwtException
        // Esto es el comportamiento esperado y correcto de JWT
        assertThrows(io.jsonwebtoken.ExpiredJwtException.class, () -> {
            jwtService.extractExpiration(token);
        });
    }
}
