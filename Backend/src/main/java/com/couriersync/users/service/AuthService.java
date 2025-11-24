package com.couriersync.users.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.couriersync.users.entity.Usuario;
import com.couriersync.users.repository.UsuarioRepository;

@Service
public class AuthService {
 
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public boolean authenticate(String username, String contraseña, int rol) {
        Usuario usuario = null;
        try {
            usuario = usuarioRepository.findByUsuario(username);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (usuario == null) {
            System.out.println("Usuario no encontrado" + username);
            return false;
        }        
        // Comparar contraseña (hash vs lo que mandó el usuario)
        boolean passwordMatches = passwordEncoder.matches(contraseña, usuario.getContraseña());

        // Comparar rol
        boolean roleMatches = usuario.getRol() == rol;

        return passwordMatches && roleMatches;
    }

    public Usuario findByCedula(String cedula) {
        return usuarioRepository.findByCedula(cedula);
    }
    public Usuario findByUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
