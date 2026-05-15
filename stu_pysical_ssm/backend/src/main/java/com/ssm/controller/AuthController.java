package com.ssm.controller;

import com.ssm.dto.ApiResponse;
import com.ssm.dto.LoginRequest;
import com.ssm.dto.LoginResponse;
import com.ssm.po.User;
import com.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        User user = userService.login(request.getUsername(), request.getPassword());
        if (user == null) {
            return ApiResponse.fail(401, "用户名或密码错误");
        }
        session.setAttribute("loginUser", user);
        LoginResponse resp = new LoginResponse(user.getUsername(), user.getRole());
        return ApiResponse.success("登录成功", resp);
    }

    @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody LoginRequest request) {
        boolean ok = userService.register(request.getUsername(), request.getPassword());
        if (!ok) {
            return ApiResponse.fail(400, "用户名已存在或注册失败");
        }
        return ApiResponse.success("注册成功，请登录");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.success("退出成功");
    }
}