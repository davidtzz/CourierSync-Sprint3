package com.couriersync.users.dto;

import lombok.Data;

@Data
public class MfaRequest {
    private String cedula;
    private String code;
    
    public MfaRequest() {}
    
    public MfaRequest(String cedula, String code) {
        this.cedula = cedula;
        this.code = code;
    }
}
