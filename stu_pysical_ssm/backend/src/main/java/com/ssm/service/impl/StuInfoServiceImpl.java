package com.ssm.service.impl;

import com.ssm.dao.StuInfoDao;
import com.ssm.dto.StudentStatisticsResponse;
import com.ssm.po.StuInfo;
import com.ssm.service.StuInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StuInfoServiceImpl implements StuInfoService {

    private static final String GENDER_MALE = "男";
    private static final String GENDER_FEMALE = "女";
    private static final double PASS_SCORE = 60.0;
    private static final String ZERO_DECIMAL = "0.0";

    private final StuInfoDao stuInfoDao;

    @Autowired
    public StuInfoServiceImpl(StuInfoDao stuInfoDao) {
        this.stuInfoDao = stuInfoDao;
    }

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

    @Override
    public StudentStatisticsResponse getStatistics(String keyword) {
        List<StuInfo> students = findByKeyword(keyword);
        StudentStatisticsAccumulator statistics = new StudentStatisticsAccumulator();

        for (StuInfo student : students) {
            statistics.add(student);
        }

        return statistics.toResponse();
    }

    private static Double calculateBmi(Double height, Double weight) {
        if (height == null || weight == null || height <= 0 || weight <= 0) {
            return null;
        }
        double heightMeter = height / 100.0;
        return weight / (heightMeter * heightMeter);
    }

    private static String formatOneDecimal(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).toPlainString();
    }

    private static class StudentStatisticsAccumulator {
        private double overallScoreTotal;
        private int overallScoreCount;
        private final GenderAccumulator male = new GenderAccumulator();
        private final GenderAccumulator female = new GenderAccumulator();

        void add(StuInfo student) {
            Double score = student.getScore();
            if (score != null) {
                overallScoreTotal += score;
                overallScoreCount++;
            }

            GenderAccumulator genderAccumulator = getGenderAccumulator(student.getGender());
            if (genderAccumulator == null) {
                return;
            }

            genderAccumulator.addScore(score);
            genderAccumulator.addBmi(calculateBmi(student.getHeight(), student.getWeight()));
        }

        StudentStatisticsResponse toResponse() {
            String overallAverageScore = overallScoreCount == 0
                    ? ZERO_DECIMAL
                    : formatOneDecimal(overallScoreTotal / overallScoreCount);
            return new StudentStatisticsResponse(overallAverageScore, male.toSummary(), female.toSummary());
        }

        private GenderAccumulator getGenderAccumulator(String gender) {
            if (GENDER_MALE.equals(gender)) {
                return male;
            }
            if (GENDER_FEMALE.equals(gender)) {
                return female;
            }
            return null;
        }
    }

    private static class GenderAccumulator {
        private double scoreTotal;
        private int scoreCount;
        private double bmiTotal;
        private int bmiCount;
        private int failedCount;

        void addScore(Double score) {
            if (score == null) {
                return;
            }
            scoreTotal += score;
            scoreCount++;
            if (score < PASS_SCORE) {
                failedCount++;
            }
        }

        void addBmi(Double bmi) {
            if (bmi == null) {
                return;
            }
            bmiTotal += bmi;
            bmiCount++;
        }

        StudentStatisticsResponse.GenderSummary toSummary() {
            String averageScore = scoreCount == 0 ? ZERO_DECIMAL : formatOneDecimal(scoreTotal / scoreCount);
            String averageBmi = bmiCount == 0 ? ZERO_DECIMAL : formatOneDecimal(bmiTotal / bmiCount);
            return new StudentStatisticsResponse.GenderSummary(averageScore, averageBmi, failedCount);
        }
    }
}
