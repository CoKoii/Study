package com.study.studentphysical.domain.student.controller;

import com.study.studentphysical.common.ApiResponse;
import com.study.studentphysical.common.PageResult;
import com.study.studentphysical.domain.student.dto.StudentQuery;
import com.study.studentphysical.domain.student.entity.Student;
import com.study.studentphysical.domain.student.service.StudentService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ApiResponse<PageResult<Student>> list(StudentQuery query) {
        return ApiResponse.success("查询成功", studentService.queryStudents(query));
    }

    @GetMapping("/{stuNo}")
    public ApiResponse<Student> detail(@PathVariable("stuNo") String stuNo) {
        return ApiResponse.success("查询成功", studentService.getByStuNo(stuNo));
    }

    @PostMapping
    public ApiResponse<Student> create(@RequestBody Student student) {
        return ApiResponse.success("新增成功", studentService.create(student));
    }

    @PutMapping("/{stuNo}")
    public ApiResponse<Student> update(@PathVariable("stuNo") String stuNo, @RequestBody Student student) {
        return ApiResponse.success("修改成功", studentService.update(stuNo, student));
    }

    @DeleteMapping("/{stuNo}")
    public ApiResponse<Void> delete(@PathVariable("stuNo") String stuNo) {
        studentService.delete(stuNo);
        return ApiResponse.success("删除成功");
    }
}
