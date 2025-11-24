package com.couriersync.dto;

import lombok.Data;

@Data
public class MfaRequest {
    private String cedula;
    private String code;
    
    public MfaRequest() {}

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MfaRequest(String cedula, String code) {
        this.cedula = cedula;
        this.code = code;
    }
}
