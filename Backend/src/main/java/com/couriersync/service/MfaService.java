package com.couriersync.service;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

@Service
public class MfaService {

    private final CodeVerifier verifier;
    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();

    public MfaService() {
        TimeProvider timeProvider = new SystemTimeProvider();
        DefaultCodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6);
        this.verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    }

    public boolean verifyCode(String secret, String code) {
        return verifier.isValidCode(secret, code);
    }

    public String generateSecret() {
        return secretGenerator.generate();
    }
}
