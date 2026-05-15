package com.ssm.service.impl;

import com.ssm.dao.StuInfoDao;
import com.ssm.dao.StuTestRecordDao;
import com.ssm.po.StuTestRecord;
import com.ssm.service.StuTestRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StuTestRecordServiceImpl implements StuTestRecordService {

    @Autowired
    private StuTestRecordDao recordDao;
    @Autowired
    private StuInfoDao stuInfoDao;

    private void computeBmiAndWarning(StuTestRecord record) {
        if (record.getHeight() != null && record.getWeight() != null && record.getHeight() > 0) {
            double bmi = record.getWeight() / Math.pow(record.getHeight() / 100.0, 2);
            record.setBmi(Math.round(bmi * 10) / 10.0);
            String warning;
            if (bmi < 18.5) warning = "体重偏轻";
            else if (bmi < 24) warning = "正常";
            else if (bmi < 27) warning = "超重";
            else warning = "肥胖";
            record.setWarningTag(warning);
        }
    }

    @Override
    public boolean save(StuTestRecord record) {
        if (stuInfoDao.findByStuNo(record.getStuNo()) == null) {
            throw new IllegalArgumentException("学号不存在，无法添加体测记录");
        }
        computeBmiAndWarning(record);
        return recordDao.insert(record) > 0;
    }

    @Override
    public boolean updateByStuNoAndTerm(StuTestRecord record) {
        computeBmiAndWarning(record);
        return recordDao.updateByStuNoAndTerm(record) > 0;
    }

    @Override
    public boolean removeByStuNoAndTerm(String stuNo, String term) {
        return recordDao.deleteByStuNoAndTerm(stuNo, term) > 0;
    }

    @Override
    public StuTestRecord findByStuNoAndTerm(String stuNo, String term) {
        return recordDao.findByStuNoAndTerm(stuNo, term);
    }

    @Override
    public List<StuTestRecord> findByCondition(String stuNo, String term) {
        return recordDao.findByCondition(stuNo, term);
    }

    @Override
    public List<StuTestRecord> findAll() {
        return recordDao.findAll();
    }
}