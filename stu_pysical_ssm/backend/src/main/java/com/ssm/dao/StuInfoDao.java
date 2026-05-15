package com.ssm.dao;

import com.ssm.po.StuInfo;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface StuInfoDao {
    int insert(StuInfo stuInfo);
    int deleteByStuNo(@Param("stuNo") String stuNo);
    int updateByStuNo(StuInfo stuInfo);
    StuInfo findByStuNo(@Param("stuNo") String stuNo);
    List<StuInfo> findByKeyword(@Param("keyword") String keyword);
    List<StuInfo> findAll();
}