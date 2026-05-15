package com.ssm.controller;

import com.ssm.dto.ApiResponse;
import com.ssm.po.StuTestRecord;
import com.ssm.service.StuTestRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-records")
public class TestRecordController {

    @Autowired
    private StuTestRecordService recordService;

    @GetMapping
    public ApiResponse<List<StuTestRecord>> list(@RequestParam(required = false) String stuNo,
                                                 @RequestParam(required = false) String term) {
        return ApiResponse.success("查询成功", recordService.findByCondition(stuNo, term));
    }

    @PostMapping
    public ApiResponse<StuTestRecord> create(@RequestBody StuTestRecord record) {
        recordService.save(record);
        return ApiResponse.success("新增体测记录成功", record);
    }

    @PutMapping
    public ApiResponse<StuTestRecord> update(@RequestBody StuTestRecord record) {
        if (record.getStuNo() == null || record.getTerm() == null) {
            throw new IllegalArgumentException("学号和学期不能为空");
        }
        recordService.updateByStuNoAndTerm(record);
        return ApiResponse.success("更新成功", record);
    }

    @DeleteMapping
    public ApiResponse<Void> delete(@RequestParam String stuNo, @RequestParam String term) {
        recordService.removeByStuNoAndTerm(stuNo, term);
        return ApiResponse.success("删除成功");
    }
}