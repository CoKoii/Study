package com.ssm.dao;

import com.ssm.po.StuTestRecord;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface StuTestRecordDao {
    int insert(StuTestRecord record);
    int updateByStuNoAndTerm(StuTestRecord record);
    int deleteByStuNoAndTerm(@Param("stuNo") String stuNo, @Param("term") String term);
    StuTestRecord findByStuNoAndTerm(@Param("stuNo") String stuNo, @Param("term") String term);
    List<StuTestRecord> findByCondition(@Param("stuNo") String stuNo, @Param("term") String term);
    List<StuTestRecord> findAll();
    int countByStuNo(@Param("stuNo") String stuNo);
}