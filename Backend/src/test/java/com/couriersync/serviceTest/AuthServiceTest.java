package com.couriersync.serviceTest;

import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import com.couriersync.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AuthService authService;

    private BCryptPasswordEncoder encoder;

    @BeforeEach
    void setUp() {
        encoder = new BCryptPasswordEncoder();
    }

    @Test
    void authenticate_UsuarioValidoYPasswordCorrectaYRolCorrecto_devuelveTrue() {
        // Arrange
        String username = "juan";
        String rawPassword = "password123";
        int rol = 1;

        Usuario usuario = new Usuario();
        usuario.setUsuario(username);
        usuario.setContrasena(encoder.encode(rawPassword));
        usuario.setRol(rol);

        when(usuarioRepository.findByUsuario(username)).thenReturn(usuario);

        // Act
        boolean resultado = authService.authenticate(username, rawPassword, rol);

        // Assert
        assertTrue(resultado);
        verify(usuarioRepository, times(1)).findByUsuario(username);
    }

    @Test
    void authenticate_UsuarioNoExiste_devuelveFalse() {
        // Arrange
        String username = "noexiste";
        when(usuarioRepository.findByUsuario(username)).thenReturn(null);

        // Act
        boolean resultado = authService.authenticate(username, "1234", 1);

        // Assert
        assertFalse(resultado);
        verify(usuarioRepository, times(1)).findByUsuario(username);
    }

    @Test
    void authenticate_PasswordIncorrecta_devuelveFalse() {
        // Arrange
        String username = "juan";
        String rawPassword = "password123";
        int rol = 1;

        Usuario usuario = new Usuario();
        usuario.setUsuario(username);
        usuario.setContrasena(encoder.encode("otraClave"));
        usuario.setRol(rol);

        when(usuarioRepository.findByUsuario(username)).thenReturn(usuario);

        // Act
        boolean resultado = authService.authenticate(username, rawPassword, rol);

        // Assert
        assertFalse(resultado);
    }

    @Test
    void authenticate_RolIncorrecto_devuelveFalse() {
        // Arrange
        String username = "juan";
        String rawPassword = "password123";

        Usuario usuario = new Usuario();
        usuario.setUsuario(username);
        usuario.setContrasena(encoder.encode(rawPassword));
        usuario.setRol(2);

        when(usuarioRepository.findByUsuario(username)).thenReturn(usuario);

        // Act
        boolean resultado = authService.authenticate(username, rawPassword, 1);

        // Assert
        assertFalse(resultado);
    }

    @Test
    void findByCedula_devuelveUsuario() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setCedula("123");
        when(usuarioRepository.findByCedula("123")).thenReturn(usuario);

        // Act
        Usuario resultado = authService.findByCedula("123");

        // Assert
        assertEquals("123", resultado.getCedula());
        verify(usuarioRepository).findByCedula("123");
    }

    @Test
    void saveUsuario_guardaYDevuelveUsuario() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setUsuario("maria");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        // Act
        Usuario resultado = authService.saveUsuario(usuario);

        // Assert
        assertEquals("maria", resultado.getUsuario());
        verify(usuarioRepository).save(usuario);
    }
}
