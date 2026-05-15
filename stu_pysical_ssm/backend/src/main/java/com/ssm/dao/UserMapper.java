package com.ssm.dao;

import com.ssm.po.User;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {
    User findByUsername(@Param("username") String username);
    int insert(User user);
}