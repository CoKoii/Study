package com.study.studentphysical.domain.student.service;

import com.study.studentphysical.common.PageResult;
import com.study.studentphysical.domain.student.dto.StudentQuery;
import com.study.studentphysical.domain.student.entity.Student;

public interface StudentService {

    PageResult<Student> queryStudents(StudentQuery query);

    Student getByStuNo(String stuNo);

    Student create(Student student);

    Student update(String stuNo, Student student);

    void delete(String stuNo);
}
