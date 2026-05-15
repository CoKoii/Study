package com.ssm.service;

import com.ssm.po.StuInfo;
import java.util.List;

public interface StuInfoService {
    boolean save(StuInfo stuInfo);
    boolean removeByStuNo(String stuNo);
    boolean updateByStuNo(StuInfo stuInfo);
    StuInfo findByStuNo(String stuNo);
    List<StuInfo> findByKeyword(String keyword);
    List<StuInfo> findAll();
}