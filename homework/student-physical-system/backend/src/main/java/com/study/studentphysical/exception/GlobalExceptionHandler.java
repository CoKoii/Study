package com.study.studentphysical.exception;

import com.study.studentphysical.common.ApiResponse;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ApiResponse<Void> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ApiResponse.fail(400, exception.getMessage());
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ApiResponse<Void> handleDuplicateKeyException(DuplicateKeyException exception) {
        return ApiResponse.fail(409, exception.getMessage());
    }

    @ExceptionHandler(CannotGetJdbcConnectionException.class)
    public ApiResponse<Void> handleConnectionException(CannotGetJdbcConnectionException exception) {
        return ApiResponse.fail(500, "数据库连接失败，请确认 MySQL 服务已启动且连接配置正确");
    }

    @ExceptionHandler(DataAccessException.class)
    public ApiResponse<Void> handleDataAccessException(DataAccessException exception) {
        return ApiResponse.fail(500, "数据库访问异常: " + exception.getMostSpecificCause().getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException exception) {
        return ApiResponse.fail(400, "请求参数校验失败");
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception exception) {
        return ApiResponse.fail(500, "服务器处理异常: " + exception.getMessage());
    }
}
