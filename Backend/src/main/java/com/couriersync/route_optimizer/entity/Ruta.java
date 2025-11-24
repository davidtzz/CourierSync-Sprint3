package com.couriersync.route_optimizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tbl_rutas")
@Data

public class Ruta {

    @Id
    @Column(name = "id_ruta", nullable = false, unique = true)
    private Integer idRuta;

    @Column(name = "vehiculo_asociado", length = 25)
    private String vehiculoAsociado;

    public Integer getIdRuta() {
        return idRuta;
    }

    public void setIdRuta(Integer idRuta) {
        this.idRuta = idRuta;
    }

    public String getVehiculoAsociado() {
        return vehiculoAsociado;
    }

    public void setVehiculoAsociado(String vehiculoAsociado) {
        this.vehiculoAsociado = vehiculoAsociado;
    }

    public String getConductorAsignado() {
        return conductorAsignado;
    }

    public void setConductorAsignado(String conductorAsignado) {
        this.conductorAsignado = conductorAsignado;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }

    public Double getDistanciaTotal() {
        return distanciaTotal;
    }

    public void setDistanciaTotal(Double distanciaTotal) {
        this.distanciaTotal = distanciaTotal;
    }

    public Double getTiempoPromedio() {
        return tiempoPromedio;
    }

    public void setTiempoPromedio(Double tiempoPromedio) {
        this.tiempoPromedio = tiempoPromedio;
    }

    public Integer getIdTrafico() {
        return idTrafico;
    }

    public void setIdTrafico(Integer idTrafico) {
        this.idTrafico = idTrafico;
    }

    public Short getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Short prioridad) {
        this.prioridad = prioridad;
    }

    @Column(name = "conductor_asignado", length = 25)
    private String conductorAsignado;

    @Column(name = "id_estado", nullable = false)
    private Integer idEstado;

    @Column(name = "distancia_total", nullable = false)
    private Double distanciaTotal;

    @Column(name = "tiempo_promedio", nullable = false)
    private Double tiempoPromedio;

    @Column(name = "id_trafico", nullable = false)
    private Integer idTrafico;

    @Column(name = "prioridad", nullable = false)
    private Short prioridad;

    // Getters y Setters generados por Lombok
}
