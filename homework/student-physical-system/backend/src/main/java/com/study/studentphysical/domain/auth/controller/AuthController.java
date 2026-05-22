package com.study.studentphysical.domain.auth.controller;

import com.study.studentphysical.common.ApiResponse;
import com.study.studentphysical.domain.auth.dto.LoginRequest;
import com.study.studentphysical.domain.auth.dto.LoginResponse;
import com.study.studentphysical.domain.auth.dto.RefreshTokenRequest;
import com.study.studentphysical.domain.auth.dto.RegisterRequest;
import com.study.studentphysical.domain.auth.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<LoginResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.success("注册成功", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.success("登录成功", authService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token 刷新成功", authService.refresh(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ApiResponse.success("退出成功");
    }
}
