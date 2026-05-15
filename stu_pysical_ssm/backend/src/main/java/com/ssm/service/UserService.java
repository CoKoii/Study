package com.ssm.service;

import com.ssm.po.User;

/**
 * 用户认证与注册服务接口。
 */
public interface UserService {
    /**
     * 校验用户名和密码，返回登录用户。
     */
    User login(String username, String password);

    /**
     * 注册普通用户。
     */
    boolean register(String username, String password);
}
