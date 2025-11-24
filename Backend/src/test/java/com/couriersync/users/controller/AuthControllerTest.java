package com.couriersync.users.controller;

import com.couriersync.users.dto.UsuarioLoginDTO;
import com.couriersync.users.entity.Usuario;
import com.couriersync.users.service.AuthService;
import com.couriersync.users.service.JwtService;
import com.couriersync.users.service.SignUpService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private SignUpService signUpService;

    @MockBean
    private JwtService jwtService;

    // GET /user
    @Test
    void testGetUser() throws Exception {
        Usuario user = new Usuario();
        user.setCedula("123");
        Mockito.when(authService.findByCedula("123")).thenReturn(user);

        mockMvc.perform(get("/user?cedula=123"))
                .andExpect(status().isOk());
    }

    // POST /login (éxito sin MFA)
    @Test
    void testLoginSuccess() throws Exception {
        Mockito.when(authService.authenticate("juan", "1234", "ADMIN")).thenReturn(true);

        Usuario user = new Usuario();
        user.setCedula("111");
        user.setUsuario("juan");
        user.setRol("ADMIN");
        user.setMfaEnabled(false);

        Mockito.when(authService.findByUsuario("juan")).thenReturn(user);
        Mockito.when(jwtService.generateToken("111", "juan", "ADMIN")).thenReturn("fake-jwt");

        String body = """
            {
              "username": "juan",
              "contraseña": "1234",
              "rol": "ADMIN"
            }
            """;

        mockMvc.perform(post("/login")
                        .content(body)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt"));
    }

    // POST /logout
    @Test
    void testLogoutValidToken() throws Exception {
        Mockito.when(jwtService.extractCedula("xxx")).thenReturn("111");
        Mockito.when(jwtService.validateToken("xxx", "111")).thenReturn(true);

        mockMvc.perform(post("/logout")
                        .header("Authorization", "Bearer xxx"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cedula").value("111"));
    }
}
