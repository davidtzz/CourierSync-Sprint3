package com.couriersync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.couriersync.dto.UsuarioRegistroDTO;
import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class SignUpService {
	private final UsuarioRepository usuarioRepository;

	@Autowired
	public SignUpService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
		if (usuarioRepository.existsByCedula(dto.getCedula())) {
			throw new IllegalArgumentException("La cédula ya está registrada.");
		}
		if (!dto.getContraseña().equals(dto.getConfirmarContraseña())) {
			throw new IllegalArgumentException("Las contraseñas no coinciden.");
		}
		if (usuarioRepository.existsByUsuario(dto.getUsuario())) {
			throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
		}
		if (!validarPassword(dto.getContraseña())) {
			throw new IllegalArgumentException("La contraseña no cumple con los requisitos de seguridad.");
		}
		Usuario usuario = new Usuario();
		usuario.setUsuario(dto.getUsuario());
		usuario.setCedula(dto.getCedula());
		usuario.setNombre(dto.getNombre());
		usuario.setApellido(dto.getApellido());
		usuario.setEmail(dto.getEmail());
		usuario.setCelular(dto.getCelular());
		// Encriptar la contraseña antes de guardar
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		usuario.setContrasena(encoder.encode(dto.getContraseña()));
		usuario.setRol(dto.getRol());
		return usuarioRepository.save(usuario);
	}

	private boolean validarPassword(String password) {
    if (password.length() < 12) {
        return false;
    }

    int cantidadNumeros = 0;
    boolean tieneEspecial = false;

    for (char c : password.toCharArray()) {
		if (Character.isDigit(c)) {
            cantidadNumeros++;
        } else if ("!@#$%^&*()_+-={}[]:;\"'<>,.?/\\|".contains(String.valueOf(c))) {
            tieneEspecial = true;
        }
    }

    return cantidadNumeros >= 1 && tieneEspecial;
}
}
