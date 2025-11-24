package com.couriersync.route_optimizer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.repository.RutaRepository;

import java.util.Optional;

@Service
public class RutaService {

    @Autowired
    private RutaRepository rutaRepository;

    // Crear nueva ruta
    public Ruta crearRuta(Ruta ruta) {
        if (ruta.getIdRuta() != null && rutaRepository.existsById(ruta.getIdRuta())) {
            throw new DataIntegrityViolationException("El ID de la ruta ya existe.");
        }

        if (ruta.getDistanciaTotal() == null || ruta.getTiempoPromedio() == null ||
            ruta.getIdTrafico() == null || ruta.getPrioridad() == null) {
            throw new IllegalArgumentException("Faltan campos obligatorios en la ruta.");
        }

        if (ruta.getIdEstado() == null) {
            ruta.setIdEstado(1); // estado activo por defecto
        }

        return rutaRepository.save(ruta);
    }

    // Editar ruta existente
    public Ruta actualizarRuta(Integer idRuta, Ruta rutaActualizada) {
        Optional<Ruta> existenteOpt = rutaRepository.findById(idRuta);
        if (existenteOpt.isEmpty()) {
            throw new IllegalArgumentException("Ruta no encontrada con id: " + idRuta);
        }

        Ruta existente = existenteOpt.get();

        // Solo se actualizan los campos que se envíen con valor
        if (rutaActualizada.getVehiculoAsociado() != null)
            existente.setVehiculoAsociado(rutaActualizada.getVehiculoAsociado());

        if (rutaActualizada.getConductorAsignado() != null)
            existente.setConductorAsignado(rutaActualizada.getConductorAsignado());

        if (rutaActualizada.getDistanciaTotal() != null)
            existente.setDistanciaTotal(rutaActualizada.getDistanciaTotal());

        if (rutaActualizada.getTiempoPromedio() != null)
            existente.setTiempoPromedio(rutaActualizada.getTiempoPromedio());

        if (rutaActualizada.getIdTrafico() != null)
            existente.setIdTrafico(rutaActualizada.getIdTrafico());

        if (rutaActualizada.getPrioridad() != null)
            existente.setPrioridad(rutaActualizada.getPrioridad());

        if (rutaActualizada.getIdEstado() != null)
            existente.setIdEstado(rutaActualizada.getIdEstado());

        return rutaRepository.save(existente);
    }

    // Eliminar ruta por ID
    public void eliminarRuta(Integer idRuta) {
        if (!rutaRepository.existsById(idRuta)) {
            throw new IllegalArgumentException("Ruta no encontrada con id: " + idRuta);
        }
        rutaRepository.deleteById(idRuta);
    }
}

