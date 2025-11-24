package com.couriersync.users.service;

import com.couriersync.users.entity.Rol;
import com.couriersync.users.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RolService {
    
    @Autowired
    private RolRepository rolRepository;
    
    // Caché en memoria para evitar consultas a BD en cada request
    private Map<Integer, String> rolesCache = new HashMap<>();
    
    /**
     * Carga los roles en memoria al iniciar la aplicación
     */
    @PostConstruct
    public void cargarRolesEnCache() {
        List<Rol> roles = rolRepository.findAll();
        for (Rol rol : roles) {
            String nombreRol = normalizarNombreRol(rol.getNombreRol());
            rolesCache.put(rol.getIdRol(), nombreRol);
        }
        System.out.println("✅ Roles cargados en caché: " + rolesCache);
    }
    
    private String normalizarNombreRol(String nombreRol) {
        if (nombreRol == null || nombreRol.isEmpty()) {
            return "ROLE_USER";
        }
        
        String rolMayusculas = nombreRol.toUpperCase().trim();
        if (!rolMayusculas.startsWith("ROLE_")) {
            rolMayusculas = "ROLE_" + rolMayusculas;
        }
        
        return rolMayusculas;
    }

    public String obtenerNombreRolPorId(Integer idRol) {
        return rolesCache.getOrDefault(idRol, "ROLE_USER");
    }
    
    public void refrescarCache() {
        rolesCache.clear();
        cargarRolesEnCache();
    }
}