package com.ssm.service;

import com.ssm.dto.StudentStatisticsResponse;
import com.ssm.po.StuInfo;
import java.util.List;

/**
 * 学生基础信息服务接口。
 */
public interface StuInfoService {
    /**
     * 新增学生信息。
     */
    boolean save(StuInfo stuInfo);

    /**
     * 按学号删除学生信息。
     */
    boolean removeByStuNo(String stuNo);

    /**
     * 按学号更新学生信息。
     */
    boolean updateByStuNo(StuInfo stuInfo);

    /**
     * 按学号查询单个学生。
     */
    StuInfo findByStuNo(String stuNo);

    /**
     * 按关键字查询学生，关键字可为空。
     */
    List<StuInfo> findByKeyword(String keyword);

    /**
     * 查询全部学生信息。
     */
    List<StuInfo> findAll();

    /**
     * 统计学生成绩和 BMI 数据。
     */
    StudentStatisticsResponse getStatistics(String keyword);
}
