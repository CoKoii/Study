package com.ssm.controller;

import com.ssm.dto.ApiResponse;
import com.ssm.dto.StudentStatisticsResponse;
import com.ssm.po.StuInfo;
import com.ssm.service.StuInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StuInfoController {

    private final StuInfoService stuInfoService;

    @Autowired
    public StuInfoController(StuInfoService stuInfoService) {
        this.stuInfoService = stuInfoService;
    }

    @GetMapping
    public ApiResponse<List<StuInfo>> list(@RequestParam(required = false) String keyword) {
        return ApiResponse.success("查询成功", stuInfoService.findByKeyword(keyword));
    }

    @GetMapping("/statistics")
    public ApiResponse<StudentStatisticsResponse> statistics(@RequestParam(required = false) String keyword) {
        return ApiResponse.success("统计成功", stuInfoService.getStatistics(keyword));
    }

    @GetMapping("/{stuNo}")
    public ApiResponse<StuInfo> detail(@PathVariable("stuNo") String stuNo) {
        StuInfo stuInfo = stuInfoService.findByStuNo(stuNo);
        if (stuInfo == null) {
            return ApiResponse.fail(404, "未找到对应学号的学生信息");
        }
        return ApiResponse.success("查询成功", stuInfo);
    }

    @PostMapping
    public ApiResponse<StuInfo> create(@RequestBody StuInfo stuInfo) {
        validateStudent(stuInfo, false);
        boolean ok = stuInfoService.save(stuInfo);
        if (!ok) {
            return ApiResponse.fail("新增失败");
        }
        return ApiResponse.success("新增成功", stuInfo);
    }

    @PutMapping("/{stuNo}")
    public ApiResponse<StuInfo> update(@PathVariable("stuNo") String stuNo, @RequestBody StuInfo stuInfo) {
        validateStudent(stuInfo, true);
        stuInfo.setStuNo(stuNo);
        boolean ok = stuInfoService.updateByStuNo(stuInfo);
        if (!ok) {
            return ApiResponse.fail(404, "修改失败，未找到对应学号");
        }
        return ApiResponse.success("修改成功", stuInfo);
    }

    @DeleteMapping("/{stuNo}")
    public ApiResponse<Void> delete(@PathVariable("stuNo") String stuNo) {
        boolean ok = stuInfoService.removeByStuNo(stuNo);
        if (!ok) {
            return ApiResponse.fail(404, "删除失败，未找到对应学号");
        }
        return ApiResponse.success("删除成功");
    }

    private void validateStudent(StuInfo stuInfo, boolean update) {
        if (stuInfo == null) {
            throw new IllegalArgumentException("请求体不能为空");
        }
        if (!update && isBlank(stuInfo.getStuNo())) {
            throw new IllegalArgumentException("学号不能为空");
        }
        if (isBlank(stuInfo.getStuName())) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        if (isBlank(stuInfo.getGender())) {
            throw new IllegalArgumentException("性别不能为空");
        }
        if (stuInfo.getAge() == null || stuInfo.getAge() <= 0) {
            throw new IllegalArgumentException("年龄必须大于0");
        }
        if (isBlank(stuInfo.getClassName())) {
            throw new IllegalArgumentException("班级不能为空");
        }
        if (stuInfo.getHeight() == null || stuInfo.getHeight() <= 0) {
            throw new IllegalArgumentException("身高必须大于0");
        }
        if (stuInfo.getWeight() == null || stuInfo.getWeight() <= 0) {
            throw new IllegalArgumentException("体重必须大于0");
        }
        if (stuInfo.getScore() == null || stuInfo.getScore() < 0) {
            throw new IllegalArgumentException("体测成绩不能小于0");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
