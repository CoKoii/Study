package com.ssm.service.impl;

import com.ssm.dao.UserMapper;
import com.ssm.po.User;
import com.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现，负责登录校验和普通用户注册。
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 根据用户名查询用户，并校验密码是否一致。
     */
    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    /**
     * 用户名不存在时创建一个默认角色为 user 的账号。
     */
    @Override
    public boolean register(String username, String password) {
        User existUser = userMapper.findByUsername(username);
        if (existUser != null) {
            return false;
        }
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setRole("user");
        return userMapper.insert(newUser) > 0;
    }
}
