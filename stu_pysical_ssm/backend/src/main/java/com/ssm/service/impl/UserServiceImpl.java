package com.ssm.service.impl;

import com.ssm.dao.UserMapper;
import com.ssm.po.User;
import com.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

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