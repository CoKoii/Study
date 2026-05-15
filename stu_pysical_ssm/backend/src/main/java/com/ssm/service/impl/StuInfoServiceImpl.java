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

/**
 * 学生基础信息服务实现，负责增删改查和统计逻辑。
 */
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

    /**
     * 保存一条学生基础信息。
     */
    @Override
    public boolean save(StuInfo stuInfo) {
        return stuInfoDao.insert(stuInfo) > 0;
    }

    /**
     * 根据学号删除学生信息。
     */
    @Override
    public boolean removeByStuNo(String stuNo) {
        return stuInfoDao.deleteByStuNo(stuNo) > 0;
    }

    /**
     * 根据学号更新学生信息。
     */
    @Override
    public boolean updateByStuNo(StuInfo stuInfo) {
        return stuInfoDao.updateByStuNo(stuInfo) > 0;
    }

    /**
     * 根据学号查询学生详情。
     */
    @Override
    public StuInfo findByStuNo(String stuNo) {
        return stuInfoDao.findByStuNo(stuNo);
    }

    /**
     * 按关键字查询学生；关键字为空时返回全部。
     */
    @Override
    public List<StuInfo> findByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return stuInfoDao.findAll();
        }
        return stuInfoDao.findByKeyword(keyword.trim());
    }

    /**
     * 查询全部学生信息。
     */
    @Override
    public List<StuInfo> findAll() {
        return stuInfoDao.findAll();
    }

    /**
     * 汇总学生平均成绩、男女平均 BMI 和不及格人数。
     */
    @Override
    public StudentStatisticsResponse getStatistics(String keyword) {
        List<StuInfo> students = findByKeyword(keyword);
        StudentStatisticsAccumulator statistics = new StudentStatisticsAccumulator();

        for (StuInfo student : students) {
            statistics.add(student);
        }

        return statistics.toResponse();
    }

    /**
     * 根据身高和体重计算 BMI。
     */
    private static Double calculateBmi(Double height, Double weight) {
        if (height == null || weight == null || height <= 0 || weight <= 0) {
            return null;
        }
        double heightMeter = height / 100.0;
        return weight / (heightMeter * heightMeter);
    }

    /**
     * 将数值保留一位小数。
     */
    private static String formatOneDecimal(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).toPlainString();
    }

    /**
     * 统计总体数据以及按性别拆分的数据。
     */
    private static class StudentStatisticsAccumulator {
        private double overallScoreTotal;
        private int overallScoreCount;
        private final GenderAccumulator male = new GenderAccumulator();
        private final GenderAccumulator female = new GenderAccumulator();

        /**
         * 将单个学生数据累加到统计结果中。
         */
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

        /**
         * 生成最终统计响应对象。
         */
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

    /**
     * 统计某一性别下的成绩、BMI 和不及格人数。
     */
    private static class GenderAccumulator {
        private double scoreTotal;
        private int scoreCount;
        private double bmiTotal;
        private int bmiCount;
        private int failedCount;

        /**
         * 累加成绩并统计不及格人数。
         */
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

        /**
         * 累加 BMI 数据。
         */
        void addBmi(Double bmi) {
            if (bmi == null) {
                return;
            }
            bmiTotal += bmi;
            bmiCount++;
        }

        /**
         * 转换为接口返回使用的汇总对象。
         */
        StudentStatisticsResponse.GenderSummary toSummary() {
            String averageScore = scoreCount == 0 ? ZERO_DECIMAL : formatOneDecimal(scoreTotal / scoreCount);
            String averageBmi = bmiCount == 0 ? ZERO_DECIMAL : formatOneDecimal(bmiTotal / bmiCount);
            return new StudentStatisticsResponse.GenderSummary(averageScore, averageBmi, failedCount);
        }
    }
}
