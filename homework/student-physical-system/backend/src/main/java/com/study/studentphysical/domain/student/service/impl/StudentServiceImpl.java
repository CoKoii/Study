package com.study.studentphysical.domain.student.service.impl;

import com.study.studentphysical.common.PageResult;
import com.study.studentphysical.domain.student.dto.StudentQuery;
import com.study.studentphysical.domain.student.entity.Student;
import com.study.studentphysical.domain.student.mapper.StudentMapper;
import com.study.studentphysical.domain.student.service.StudentService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentMapper studentMapper;

    public StudentServiceImpl(StudentMapper studentMapper) {
        this.studentMapper = studentMapper;
    }

    @Override
    public PageResult<Student> queryStudents(StudentQuery query) {
        normalizeQuery(query);
        long total = studentMapper.count(query);
        List<Student> records = studentMapper.selectPage(query);
        return new PageResult<Student>(records, total, query.getPageNum(), query.getPageSize());
    }

    @Override
    public Student getByStuNo(String stuNo) {
        Student student = studentMapper.selectByStuNo(stuNo);
        if (student == null) {
            throw new IllegalArgumentException("未找到对应学号的学生信息");
        }
        return student;
    }

    @Override
    public Student create(Student student) {
        validateStudent(student, false);
        if (studentMapper.selectByStuNo(student.getStuNo()) != null) {
            throw new DuplicateKeyException("学号已存在，请勿重复新增");
        }
        studentMapper.insert(trimStudent(student));
        return student;
    }

    @Override
    public Student update(String stuNo, Student student) {
        validateStudent(student, true);
        student.setStuNo(stuNo);
        trimStudent(student);
        int updated = studentMapper.updateByStuNo(student);
        if (updated <= 0) {
            throw new IllegalArgumentException("修改失败，未找到对应学号");
        }
        return studentMapper.selectByStuNo(stuNo);
    }

    @Override
    public void delete(String stuNo) {
        int deleted = studentMapper.deleteByStuNo(stuNo);
        if (deleted <= 0) {
            throw new IllegalArgumentException("删除失败，未找到对应学号");
        }
    }

    private void normalizeQuery(StudentQuery query) {
        if (query.getPageNum() == null || query.getPageNum() < 1) {
            query.setPageNum(1);
        }
        if (query.getPageSize() == null || query.getPageSize() < 1) {
            query.setPageSize(10);
        }
        if (query.getPageSize() > 100) {
            query.setPageSize(100);
        }
        if (query.getKeyword() != null) {
            query.setKeyword(query.getKeyword().trim());
        }
    }

    private Student trimStudent(Student student) {
        student.setStuNo(trim(student.getStuNo()));
        student.setStuName(trim(student.getStuName()));
        student.setGender(trim(student.getGender()));
        student.setClassName(trim(student.getClassName()));
        return student;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private void validateStudent(Student student, boolean update) {
        if (student == null) {
            throw new IllegalArgumentException("请求体不能为空");
        }
        if (!update && !StringUtils.hasText(student.getStuNo())) {
            throw new IllegalArgumentException("学号不能为空");
        }
        if (!StringUtils.hasText(student.getStuName())) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        if (!StringUtils.hasText(student.getGender())) {
            throw new IllegalArgumentException("性别不能为空");
        }
        if (student.getAge() == null || student.getAge() <= 0) {
            throw new IllegalArgumentException("年龄必须大于0");
        }
        if (!StringUtils.hasText(student.getClassName())) {
            throw new IllegalArgumentException("班级不能为空");
        }
        if (student.getHeight() == null || student.getHeight() <= 0) {
            throw new IllegalArgumentException("身高必须大于0");
        }
        if (student.getWeight() == null || student.getWeight() <= 0) {
            throw new IllegalArgumentException("体重必须大于0");
        }
        if (student.getScore() == null || student.getScore() < 0) {
            throw new IllegalArgumentException("体测成绩不能小于0");
        }
    }
}
