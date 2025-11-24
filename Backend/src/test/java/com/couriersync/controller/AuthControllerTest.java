package com.couriersync.controller;

import com.couriersync.dto.UsuarioRegistroDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.couriersync.dto.UsuarioLoginDTO;
import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UsuarioRepository usuarioRepository; // Se "simula" para evitar conexión real a DB

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    //Historia de usuario 1.1 Iniciar sesión

    @BeforeEach
    void setUp() {
        // Usuario válido simulado
        Usuario usuario = new Usuario();
        usuario.setUsuario("usuario1");
        usuario.setContrasena(passwordEncoder.encode("1234"));
        usuario.setRol(1);

        Mockito.when(usuarioRepository.findByUsuario("usuario1"))
                .thenReturn(usuario);
        Mockito.when(usuarioRepository.existsByUsuario("usuario1"))
                .thenReturn(true);
    }

    @Test
    void testInicioSesionExitoso() throws Exception {
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO();
        loginDTO.setUsername("usuario1");
        loginDTO.setContraseña("1234");
        loginDTO.setRol(1);
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Login successful"));
    }

    @Test
    void testInicioSesionExcepcional() throws Exception {
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO();
        loginDTO.setUsername("usuario1");
        loginDTO.setContraseña(" ");
        loginDTO.setRol(1);
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(result ->
                        assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
    }
    @Test
    void testContrasenaIncorrecta() throws Exception {
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO();
        loginDTO.setUsername("usuario1");
        loginDTO.setContraseña("1235");
        loginDTO.setRol(1);
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }
    @Test
    void testUsuarioInexistente() throws Exception {
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO();
        loginDTO.setUsername("usuario2");
        loginDTO.setContraseña("1234");
        loginDTO.setRol(1);
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }
    @Test
    void testCamposVacios() throws Exception {
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO();
        loginDTO.setUsername("");
        loginDTO.setContraseña(" ");
        loginDTO.setRol(null);
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(result ->
                        assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
    }

    @Test
    void testRegistroExitoso() throws Exception{
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setUsuario("usuario2");
        registroDTO.setCedula("1122233");
        registroDTO.setNombre("David");
        registroDTO.setApellido("Tovar");
        registroDTO.setEmail("david@gmail.com");
        registroDTO.setCelular("3001234567");
        registroDTO.setContraseña("david12345678!");
        registroDTO.setConfirmarContraseña("david12345678!");
        registroDTO.setRol(1);
        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario creado con éxito"));
        System.out.println("La prueba pasó correctamente");
    }
    @Test
    void testRegistroUsuarioExistente() throws Exception{
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setUsuario("usuario1");
        registroDTO.setCedula("1122233");
        registroDTO.setNombre("David");
        registroDTO.setApellido("Tovar");
        registroDTO.setEmail("david@gmail.com");
        registroDTO.setCelular("3001234567");
        registroDTO.setContraseña("david12345678!");
        registroDTO.setConfirmarContraseña("david12345678!");
        registroDTO.setRol(1);
        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest()  );
    }
    @Test
    void testRegistroUsuarioCamposVacios() throws Exception{
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setUsuario("");
        registroDTO.setCedula("");
        registroDTO.setNombre("David");
        registroDTO.setApellido("Tovar");
        registroDTO.setEmail("david@gmail.com");
        registroDTO.setCelular("3001234567");
        registroDTO.setContraseña("david12345678!");
        registroDTO.setConfirmarContraseña("david12345678!");
        registroDTO.setRol(1);
            mockMvc.perform(post("/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(registroDTO)))
                    .andExpect(result ->
                            assertTrue(result.getResolvedException()instanceof MethodArgumentNotValidException));
    }
    @Test
    void testContrasenasNoCoinciden() throws Exception{
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setUsuario("usuario2");
        registroDTO.setCedula("1122233");
        registroDTO.setNombre("David");
        registroDTO.setApellido("Tovar");
        registroDTO.setEmail("david@gmail.com");
        registroDTO.setCelular("3001234567");
        registroDTO.setContraseña("david12345678!");
        registroDTO.setConfirmarContraseña("davi112345678!");
        registroDTO.setRol(1);
        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registroDTO)))
                .andExpect(status().isBadRequest());
    }
    @Test
    void testCierreSesionExitoso() throws Exception {
        // Simular que el usuario tiene una sesión activa
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuario", "usuario1");

        mockMvc.perform(post("/logout").session(session))
                .andExpect(status().isFound()) // Debe responder 200 OK
               // .andExpect(content().string("Sesión cerrada exitosamente"))
                .andDo(result -> {
                    System.out.println("Prueba pasa exitosamente");
                });

        // Verificar que la sesión fue invalidada
        assertTrue(session.isInvalid(), "La sesión debería haberse invalidado");
    }
    @RestController
    @RequestMapping("/panel")
    static class ProtectedTestController {
        @GetMapping
        public String panel() {
            return "Contenido interno";
        }
    }
    @Test
    public void testAccessoRestringidoCierreSesion() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "usuario1"); // simula sesión activa

        mockMvc.perform(post("/logout").session(session))
                .andExpect(status().isFound());

        mockMvc.perform(get("/panel")) // cambia "/panel" por tu endpoint real protegido
                .andExpect(status().isFound()) // se espera redirección al login
                .andExpect(redirectedUrlPattern("/login?logout")); // cualquier variante de /login
    }
}

