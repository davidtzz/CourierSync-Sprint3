package com.couriersync.users.service;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.CodeGenerationException;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

@Service
public class MfaService {

    private final CodeVerifier verifier;
    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final DefaultCodeGenerator codeGenerator;
    private final TimeProvider timeProvider;

    public MfaService() {
        this.timeProvider = new SystemTimeProvider();
        this.codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6);
        this.verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    }

    public boolean verifyCode(String secret, String code) {
        // Logging temporal para debugging
        System.out.println("=== MFA VERIFICATION DEBUG ===");
        System.out.println("Secret recibido: " + secret);
        System.out.println("Secret length: " + (secret != null ? secret.length() : 0));
        System.out.println("Secret bytes: " + (secret != null ? java.util.Arrays.toString(secret.getBytes()) : "null"));
        System.out.println("Code recibido: " + code);
        System.out.println("Code length: " + (code != null ? code.length() : 0));
        System.out.println("Code bytes: " + (code != null ? java.util.Arrays.toString(code.getBytes()) : "null"));
        
        try {
            // Generar códigos manualmente para verificar directamente
            // Esto nos permite ver exactamente qué código se está generando
            long currentTime = timeProvider.getTime();
            System.out.println("Tiempo actual (segundos desde epoch): " + currentTime);
            System.out.println("Tiempo actual (formato legible): " + new java.util.Date(currentTime * 1000));
            
            // CRÍTICO: Verificar que el secret sea válido Base32
            // Los secrets TOTP deben estar en Base32 (solo A-Z, 2-7)
            String base32Pattern = "^[A-Z2-7]+$";
            if (!secret.matches(base32Pattern)) {
                System.err.println("ERROR: El secret NO es Base32 válido!");
                System.err.println("Secret contiene caracteres inválidos: " + secret);
                return false;
            }
            System.out.println("✓ Secret es Base32 válido");
            
            // Generar código para el período actual
            String currentCode = codeGenerator.generate(secret, currentTime);
            System.out.println("Código generado para período actual: " + currentCode);
            
            // Generar códigos para períodos adyacentes (ventana de ±2 períodos = ±60 segundos)
            String previousCode1 = codeGenerator.generate(secret, currentTime - 30);
            String previousCode2 = codeGenerator.generate(secret, currentTime - 60);
            String nextCode1 = codeGenerator.generate(secret, currentTime + 30);
            String nextCode2 = codeGenerator.generate(secret, currentTime + 60);
            
            System.out.println("\n=== CÓDIGOS GENERADOS ===");
            System.out.println("Código período -60s: " + previousCode2);
            System.out.println("Código período -30s: " + previousCode1);
            System.out.println(">>> CÓDIGO PERÍODO ACTUAL: " + currentCode + " <<<");
            System.out.println("Código período +30s: " + nextCode1);
            System.out.println("Código período +60s: " + nextCode2);
            System.out.println("Código recibido del usuario: " + code);
            System.out.println("\n⚠️ COMPARA: ¿El código de Authy es alguno de estos?");
            System.out.println("   Si NO, entonces el SECRET en Authy es DIFERENTE al de la BD");
            
            // Comparar directamente
            boolean matches = code.equals(currentCode) || 
                            code.equals(previousCode1) || 
                            code.equals(previousCode2) ||
                            code.equals(nextCode1) || 
                            code.equals(nextCode2);
            
            if (matches) {
                System.out.println("✓ CÓDIGO VÁLIDO - Coincide con uno de los períodos verificados");
            } else {
                System.out.println("✗ CÓDIGO INVÁLIDO - No coincide con ningún período");
                System.out.println("   El código que debería ser ahora es: " + currentCode);
            }
            
            // Usar el verifier estándar que tiene una ventana de tiempo más amplia
            // El verifier maneja correctamente la sincronización de tiempo
            boolean verifierResult = verifier.isValidCode(secret, code);
            System.out.println("Resultado del verifier estándar: " + verifierResult);
            
            // El verifier es más confiable porque maneja correctamente la ventana de tiempo
            // Usar el resultado del verifier en lugar de la comparación manual
            System.out.println("Resultado verificación final: " + verifierResult);
            System.out.println("============================");
            return verifierResult;
        } catch (Exception e) {
            System.err.println("ERROR en verificación: " + e.getMessage());
            e.printStackTrace();
            System.out.println("============================");
            return false;
        }
    }

    public String generateSecret() {
        return secretGenerator.generate();
    }
    
    /**
     * Genera un código de prueba con el secret actual
     * Útil para debugging - muestra qué código debería generar Authy
     */
    public String generateTestCode(String secret) throws CodeGenerationException {
        long currentTime = timeProvider.getTime();
        return codeGenerator.generate(secret, currentTime);
    }
}