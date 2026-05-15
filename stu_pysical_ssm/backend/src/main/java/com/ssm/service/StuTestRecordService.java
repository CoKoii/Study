package com.ssm.service;

import com.ssm.po.StuTestRecord;
import java.util.List;

public interface StuTestRecordService {
    boolean save(StuTestRecord record);
    boolean updateByStuNoAndTerm(StuTestRecord record);
    boolean removeByStuNoAndTerm(String stuNo, String term);
    StuTestRecord findByStuNoAndTerm(String stuNo, String term);
    List<StuTestRecord> findByCondition(String stuNo, String term);
    List<StuTestRecord> findAll();
}