package com.ssm.service.impl;

import com.ssm.dao.StuInfoDao;
import com.ssm.po.StuInfo;
import com.ssm.service.StuInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StuInfoServiceImpl implements StuInfoService {

    @Autowired
    private StuInfoDao stuInfoDao;

    @Override
    public boolean save(StuInfo stuInfo) {
        return stuInfoDao.insert(stuInfo) > 0;
    }

    @Override
    public boolean removeByStuNo(String stuNo) {
        return stuInfoDao.deleteByStuNo(stuNo) > 0;
    }

    @Override
    public boolean updateByStuNo(StuInfo stuInfo) {
        return stuInfoDao.updateByStuNo(stuInfo) > 0;
    }

    @Override
    public StuInfo findByStuNo(String stuNo) {
        return stuInfoDao.findByStuNo(stuNo);
    }

    @Override
    public List<StuInfo> findByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return stuInfoDao.findAll();
        }
        return stuInfoDao.findByKeyword(keyword.trim());
    }

    @Override
    public List<StuInfo> findAll() {
        return stuInfoDao.findAll();
    }
}