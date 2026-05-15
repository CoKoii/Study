package com.ssm.service;

import com.ssm.po.StuTestRecord;
import java.util.List;

/**
 * 学生体测记录服务接口。
 */
public interface StuTestRecordService {
    /**
     * 新增体测记录。
     */
    boolean save(StuTestRecord record);

    /**
     * 按学号和学期更新体测记录。
     */
    boolean updateByStuNoAndTerm(StuTestRecord record);

    /**
     * 按学号和学期删除体测记录。
     */
    boolean removeByStuNoAndTerm(String stuNo, String term);

    /**
     * 按学号和学期查询单条体测记录。
     */
    StuTestRecord findByStuNoAndTerm(String stuNo, String term);

    /**
     * 按条件查询体测记录。
     */
    List<StuTestRecord> findByCondition(String stuNo, String term);

    /**
     * 查询全部体测记录。
     */
    List<StuTestRecord> findAll();
}
