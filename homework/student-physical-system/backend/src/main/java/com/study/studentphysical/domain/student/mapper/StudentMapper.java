package com.study.studentphysical.domain.student.mapper;

import com.study.studentphysical.domain.student.dto.StudentQuery;
import com.study.studentphysical.domain.student.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {

    List<Student> selectPage(StudentQuery query);

    long count(StudentQuery query);

    Student selectByStuNo(@Param("stuNo") String stuNo);

    int insert(Student student);

    int updateByStuNo(Student student);

    int deleteByStuNo(@Param("stuNo") String stuNo);
}
