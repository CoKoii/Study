package com.ssm.service;

import com.ssm.po.User;

public interface UserService {
    User login(String username, String password);
    boolean register(String username, String password);
}