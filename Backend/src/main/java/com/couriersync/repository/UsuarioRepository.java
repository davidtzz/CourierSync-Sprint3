package com.couriersync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.couriersync.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {   
    Usuario findByCedula(String cedula);
    Usuario findByUsuario(String usuario);
    boolean existsByCedula(String cedula);
    boolean existsByUsuario(String usuario);
}
