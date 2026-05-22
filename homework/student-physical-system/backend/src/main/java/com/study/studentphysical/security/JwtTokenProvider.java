package com.study.studentphysical.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.study.studentphysical.domain.auth.entity.AuthUser;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    public static final String ACCESS_TYPE = "access";
    public static final String REFRESH_TYPE = "refresh";

    private final AuthProperties authProperties;
    private final ObjectMapper objectMapper;

    public JwtTokenProvider(AuthProperties authProperties, ObjectMapper objectMapper) {
        this.authProperties = authProperties;
        this.objectMapper = objectMapper;
    }

    public String createAccessToken(AuthUser user) {
        return createToken(user, ACCESS_TYPE, UUID.randomUUID().toString(), accessExpiresAt());
    }

    public String createRefreshToken(AuthUser user, String tokenId) {
        return createToken(user, REFRESH_TYPE, tokenId, refreshExpiresAt());
    }

    public JwtClaims verify(String token, String expectedType) {
        if (!StringUtils.hasText(token)) {
            throw new IllegalArgumentException("登录状态已失效，请重新登录");
        }
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Token 格式不正确");
        }
        String signingInput = parts[0] + "." + parts[1];
        if (!MessageDigest.isEqual(sign(signingInput), base64UrlDecode(parts[2]))) {
            throw new IllegalArgumentException("Token 签名无效");
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(
                    base64UrlDecode(parts[1]), new TypeReference<Map<String, Object>>() {
                    });
            JwtClaims claims = new JwtClaims();
            claims.setUserId(Long.valueOf(String.valueOf(payload.get("sub"))));
            claims.setUsername(String.valueOf(payload.get("username")));
            claims.setTokenType(String.valueOf(payload.get("type")));
            claims.setTokenId(String.valueOf(payload.get("jti")));
            claims.setExpiresAt(Long.valueOf(String.valueOf(payload.get("exp"))));
            if (!expectedType.equals(claims.getTokenType())) {
                throw new IllegalArgumentException("Token 类型不正确");
            }
            if (claims.getExpiresAt() < Instant.now().getEpochSecond()) {
                throw new IllegalArgumentException("Token 已过期");
            }
            return claims;
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalArgumentException("Token 解析失败");
        }
    }

    public long accessExpiresAt() {
        return Instant.now().plusSeconds(authProperties.getAccessTokenMinutes() * 60).getEpochSecond();
    }

    public long refreshExpiresAt() {
        return Instant.now().plusSeconds(authProperties.getRefreshTokenDays() * 24 * 60 * 60).getEpochSecond();
    }

    public long accessExpiresIn() {
        return authProperties.getAccessTokenMinutes() * 60;
    }

    public long refreshExpiresIn() {
        return authProperties.getRefreshTokenDays() * 24 * 60 * 60;
    }

    private String createToken(AuthUser user, String type, String tokenId, long expiresAt) {
        try {
            Map<String, Object> header = new HashMap<String, Object>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new HashMap<String, Object>();
            payload.put("sub", user.getId());
            payload.put("username", user.getUsername());
            payload.put("type", type);
            payload.put("jti", tokenId);
            payload.put("exp", expiresAt);
            payload.put("iat", Instant.now().getEpochSecond());

            String signingInput = base64UrlEncode(objectMapper.writeValueAsBytes(header))
                    + "." + base64UrlEncode(objectMapper.writeValueAsBytes(payload));
            return signingInput + "." + base64UrlEncode(sign(signingInput));
        } catch (Exception exception) {
            throw new IllegalStateException("Token 生成失败", exception);
        }
    }

    private byte[] sign(String signingInput) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(authProperties.getSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("Token 签名失败", exception);
        }
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String text) {
        return Base64.getUrlDecoder().decode(text);
    }
}
