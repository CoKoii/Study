package com.study.studentphysical.domain.auth.mapper;

import com.study.studentphysical.domain.auth.entity.AuthRefreshToken;
import com.study.studentphysical.domain.auth.entity.AuthUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AuthMapper {

    AuthUser selectUserByUsername(@Param("username") String username);

    AuthUser selectUserById(@Param("id") Long id);

    int insertUser(AuthUser user);

    AuthRefreshToken selectRefreshToken(@Param("tokenId") String tokenId);

    int insertRefreshToken(AuthRefreshToken refreshToken);

    int revokeRefreshToken(@Param("tokenId") String tokenId);
}
