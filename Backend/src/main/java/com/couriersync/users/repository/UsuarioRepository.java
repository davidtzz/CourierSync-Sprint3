package com.couriersync.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.couriersync.users.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {   
    Usuario findByCedula(String cedula);
    Usuario findByUsuario(String usuario);
    boolean existsByCedula(String cedula);
    boolean existsByUsuario(String usuario);
}
