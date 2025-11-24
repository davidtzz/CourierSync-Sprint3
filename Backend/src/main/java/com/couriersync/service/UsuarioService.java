package com.couriersync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    public void cambiarRolDesdeToken(String token, String cedulaObjetivo, Integer nuevoRol) {
        Integer rolUsuarioAuth = jwtService.extractRol(token);
        String cedulaAuth = jwtService.extractCedula(token);

        if (rolUsuarioAuth == null || (rolUsuarioAuth != 1 && rolUsuarioAuth != 2)) {
            throw new SecurityException("No tiene permisos para cambiar roles.");
        }

        if (cedulaAuth.equals(cedulaObjetivo)) {
            throw new SecurityException("No puede modificar su propio rol.");
        }

        Usuario usuarioDestino = usuarioRepository.findByCedula(cedulaObjetivo);
        if (usuarioDestino == null) {
            throw new IllegalArgumentException("El usuario destino no existe.");
        }

        if (nuevoRol == null || nuevoRol < 1 || nuevoRol > 3) {
            throw new IllegalArgumentException("Rol inválido.");
        }

        usuarioDestino.setRol(nuevoRol);
        usuarioRepository.save(usuarioDestino);
    }
}
