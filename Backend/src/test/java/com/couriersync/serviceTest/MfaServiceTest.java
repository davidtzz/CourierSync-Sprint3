package com.couriersync.serviceTest;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.CodeGenerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.couriersync.service.MfaService;

import static org.junit.jupiter.api.Assertions.*;

class MfaServiceTest {

    private MfaService mfaService;

    @BeforeEach
    void setUp() {
        mfaService = new MfaService();
    }

    @Test
    void verifyCode_CodigoCorrecto_devuelveTrue() throws CodeGenerationException {
        // Arrange
        String secret = mfaService.generateSecret();
        
        // Generar un código válido para el secreto usando la misma configuración que el servicio
        CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6);
        String validCode = codeGenerator.generate(secret, System.currentTimeMillis() / 30000); // TOTP usa ventanas de 30 segundos

        // Act
        boolean resultado = mfaService.verifyCode(secret, validCode);

        // Assert
        assertTrue(resultado);
    }

    @Test
    void verifyCode_CodigoIncorrecto_devuelveFalse() {
        // Arrange
        String secret = mfaService.generateSecret();
        String invalidCode = "999999"; // Código claramente inválido

        // Act
        boolean resultado = mfaService.verifyCode(secret, invalidCode);

        // Assert
        assertFalse(resultado);
    }

    @Test
    void generateSecret_devuelveCadenaNoVacia() {
        // Act
        String secret = mfaService.generateSecret();

        // Assert
        assertNotNull(secret);
        assertFalse(secret.isEmpty());
        assertTrue(secret.length() > 0);
        // Verificar que sea una cadena base32 válida (típicamente 32 caracteres)
        assertTrue(secret.matches("[A-Z2-7]+"));
    }

    @Test
    void generateSecret_devuelveSecretsUnicos() {
        // Act
        String secret1 = mfaService.generateSecret();
        String secret2 = mfaService.generateSecret();

        // Assert
        assertNotEquals(secret1, secret2);
    }

    @Test
    void verifyCode_SecretoNulo_devuelveFalse() {
        // Act
        boolean resultado = mfaService.verifyCode(null, "123456");
        
        // Assert
        assertFalse(resultado);
    }

    @Test
    void verifyCode_CodigoNulo_devuelveFalse() {
        // Arrange
        String secret = mfaService.generateSecret();

        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            mfaService.verifyCode(secret, null);
        });
    }
}
