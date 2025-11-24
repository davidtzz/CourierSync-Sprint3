package com.couriersync.serviceTest;

import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import com.couriersync.service.JwtService;
import com.couriersync.service.UsuarioService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UsuarioService usuarioService;

    private String token;

    @BeforeEach
    void setUp() {
        token = "fake.jwt.token";
    }

    @Test
    void cambiarRolDesdeToken_Exito_actualizaRolCorrectamente() {
        // Arrange
        when(jwtService.extractRol(token)).thenReturn(1); // administrador
        when(jwtService.extractCedula(token)).thenReturn("111");
        Usuario usuarioDestino = new Usuario();
        usuarioDestino.setCedula("222");
        usuarioDestino.setRol(3);
        when(usuarioRepository.findByCedula("222")).thenReturn(usuarioDestino);

        // Act
        usuarioService.cambiarRolDesdeToken(token, "222", 2);

        // Assert
        assertEquals(2, usuarioDestino.getRol());
        verify(usuarioRepository).save(usuarioDestino);
    }

    @Test
    void cambiarRolDesdeToken_RolNoAutorizado_lanzaSecurityException() {
        // Arrange
        when(jwtService.extractRol(token)).thenReturn(3); // conductor (sin permisos)
        when(jwtService.extractCedula(token)).thenReturn("111");

        // Act & Assert
        SecurityException ex = assertThrows(SecurityException.class, () ->
                usuarioService.cambiarRolDesdeToken(token, "222", 2));

        assertEquals("No tiene permisos para cambiar roles.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void cambiarRolDesdeToken_MismoUsuario_lanzaSecurityException() {
        // Arrange
        when(jwtService.extractRol(token)).thenReturn(1);
        when(jwtService.extractCedula(token)).thenReturn("111");

        // Act & Assert
        SecurityException ex = assertThrows(SecurityException.class, () ->
                usuarioService.cambiarRolDesdeToken(token, "111", 2));

        assertEquals("No puede modificar su propio rol.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void cambiarRolDesdeToken_UsuarioDestinoNoExiste_lanzaIllegalArgumentException() {
        // Arrange
        when(jwtService.extractRol(token)).thenReturn(1);
        when(jwtService.extractCedula(token)).thenReturn("111");
        when(usuarioRepository.findByCedula("999")).thenReturn(null);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                usuarioService.cambiarRolDesdeToken(token, "999", 2));

        assertEquals("El usuario destino no existe.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void cambiarRolDesdeToken_RolNuevoInvalido_lanzaIllegalArgumentException() {
        // Arrange
        when(jwtService.extractRol(token)).thenReturn(1);
        when(jwtService.extractCedula(token)).thenReturn("111");
        Usuario usuarioDestino = new Usuario();
        usuarioDestino.setCedula("222");
        when(usuarioRepository.findByCedula("222")).thenReturn(usuarioDestino);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                usuarioService.cambiarRolDesdeToken(token, "222", 5));

        assertEquals("Rol inválido.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }
}
