package com.study.studentphysical.domain.auth.service.impl;

import com.study.studentphysical.domain.auth.dto.LoginRequest;
import com.study.studentphysical.domain.auth.dto.LoginResponse;
import com.study.studentphysical.domain.auth.dto.RefreshTokenRequest;
import com.study.studentphysical.domain.auth.dto.RegisterRequest;
import com.study.studentphysical.domain.auth.entity.AuthRefreshToken;
import com.study.studentphysical.domain.auth.entity.AuthUser;
import com.study.studentphysical.domain.auth.mapper.AuthMapper;
import com.study.studentphysical.domain.auth.service.AuthService;
import com.study.studentphysical.security.JwtClaims;
import com.study.studentphysical.security.JwtTokenProvider;
import com.study.studentphysical.security.PasswordHasher;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthMapper authMapper;
    private final PasswordHasher passwordHasher;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthMapper authMapper, PasswordHasher passwordHasher, JwtTokenProvider jwtTokenProvider) {
        this.authMapper = authMapper;
        this.passwordHasher = passwordHasher;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (request == null || !StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("用户名和密码不能为空");
        }
        String username = request.getUsername().trim();
        if (username.length() < 3 || username.length() > 50) {
            throw new IllegalArgumentException("用户名长度需为 3-50 个字符");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("密码长度不能少于 6 位");
        }
        if (authMapper.selectUserByUsername(username) != null) {
            throw new DuplicateKeyException("用户名已存在");
        }

        AuthUser user = new AuthUser();
        user.setUsername(username);
        user.setPasswordHash(passwordHasher.hash(request.getPassword()));
        user.setDisplayName(StringUtils.hasText(request.getDisplayName()) ? request.getDisplayName().trim() : username);
        user.setEnabled(true);
        authMapper.insertUser(user);
        return issueTokens(user);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request == null || !StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("用户名和密码不能为空");
        }
        AuthUser user = authMapper.selectUserByUsername(request.getUsername().trim());
        if (user == null || Boolean.FALSE.equals(user.getEnabled())
                || !passwordHasher.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        return issueTokens(user);
    }

    @Override
    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        if (request == null || !StringUtils.hasText(request.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token 不能为空");
        }
        JwtClaims claims = jwtTokenProvider.verify(request.getRefreshToken(), JwtTokenProvider.REFRESH_TYPE);
        AuthRefreshToken storedToken = authMapper.selectRefreshToken(claims.getTokenId());
        if (storedToken == null || Boolean.TRUE.equals(storedToken.getRevoked())
                || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token 已失效，请重新登录");
        }
        AuthUser user = authMapper.selectUserById(claims.getUserId());
        if (user == null || Boolean.FALSE.equals(user.getEnabled())) {
            throw new IllegalArgumentException("用户不可用，请重新登录");
        }
        authMapper.revokeRefreshToken(claims.getTokenId());
        return issueTokens(user);
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        if (request == null || !StringUtils.hasText(request.getRefreshToken())) {
            return;
        }
        JwtClaims claims = jwtTokenProvider.verify(request.getRefreshToken(), JwtTokenProvider.REFRESH_TYPE);
        authMapper.revokeRefreshToken(claims.getTokenId());
    }

    private LoginResponse issueTokens(AuthUser user) {
        String tokenId = UUID.randomUUID().toString();
        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user, tokenId);

        AuthRefreshToken storedToken = new AuthRefreshToken();
        storedToken.setUserId(user.getId());
        storedToken.setTokenId(tokenId);
        storedToken.setExpiresAt(LocalDateTime.ofInstant(
                Instant.ofEpochSecond(jwtTokenProvider.refreshExpiresAt()), ZoneId.systemDefault()));
        authMapper.insertRefreshToken(storedToken);

        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setAccessTokenExpiresIn(jwtTokenProvider.accessExpiresIn());
        response.setRefreshTokenExpiresIn(jwtTokenProvider.refreshExpiresIn());
        response.setUser(new LoginResponse.UserInfo(user.getId(), user.getUsername(), user.getDisplayName()));
        return response;
    }
}
