package com.study.studentphysical.domain.auth.service;

import com.study.studentphysical.domain.auth.dto.LoginRequest;
import com.study.studentphysical.domain.auth.dto.LoginResponse;
import com.study.studentphysical.domain.auth.dto.RefreshTokenRequest;
import com.study.studentphysical.domain.auth.dto.RegisterRequest;

public interface AuthService {

    LoginResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse refresh(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);
}
