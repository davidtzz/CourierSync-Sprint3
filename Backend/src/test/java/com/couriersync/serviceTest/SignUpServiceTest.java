package com.couriersync.serviceTest;

import com.couriersync.dto.UsuarioRegistroDTO;
import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import com.couriersync.service.SignUpService;

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
class SignUpServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private SignUpService signUpService;

    private UsuarioRegistroDTO dto;

    @BeforeEach
    void setUp() {
        dto = new UsuarioRegistroDTO();
        dto.setCedula("12345");
        dto.setUsuario("juan");
        dto.setNombre("Juan");
        dto.setApellido("Pérez");
        dto.setEmail("juan@mail.com");
        dto.setCelular("3001234567");
        dto.setContraseña("Password123!");
        dto.setConfirmarContraseña("Password123!");
        dto.setRol(1);
    }

    @Test
    void registrarUsuario_Exito_devuelveUsuarioGuardado() {
        // Arrange
        when(usuarioRepository.existsByCedula("12345")).thenReturn(false);
        when(usuarioRepository.existsByUsuario("juan")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Usuario resultado = signUpService.registrarUsuario(dto);

        // Assert
        assertNotNull(resultado);
        assertEquals("juan", resultado.getUsuario());
        assertTrue(new BCryptPasswordEncoder().matches("Password123!", resultado.getContrasena()));
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrarUsuario_CedulaYaRegistrada_lanzaExcepcion() {
        // Arrange
        when(usuarioRepository.existsByCedula("12345")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> signUpService.registrarUsuario(dto));

        assertEquals("La cédula ya está registrada.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_ContraseñasNoCoinciden_lanzaExcepcion() {
        // Arrange
        dto.setConfirmarContraseña("OtraClave");

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> signUpService.registrarUsuario(dto));

        assertEquals("Las contraseñas no coinciden.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_UsuarioDuplicado_lanzaExcepcion() {
        // Arrange
        when(usuarioRepository.existsByCedula("12345")).thenReturn(false);
        when(usuarioRepository.existsByUsuario("juan")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> signUpService.registrarUsuario(dto));

        assertEquals("El nombre de usuario ya está en uso.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_PasswordInsegura_lanzaExcepcion() {
        // Arrange
        dto.setContraseña("short");
        dto.setConfirmarContraseña("short");
        when(usuarioRepository.existsByCedula("12345")).thenReturn(false);
        when(usuarioRepository.existsByUsuario("juan")).thenReturn(false);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> signUpService.registrarUsuario(dto));

        assertEquals("La contraseña no cumple con los requisitos de seguridad.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }
}
