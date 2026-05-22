DROP DATABASE IF EXISTS student;
CREATE DATABASE student DEFAULT CHARACTER SET utf8mb4;
USE student;

DROP TABLE IF EXISTS stu_info;
DROP TABLE IF EXISTS auth_refresh_token;
DROP TABLE IF EXISTS auth_user;

CREATE TABLE stu_info (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stu_no VARCHAR(30) NOT NULL UNIQUE,
  stu_name VARCHAR(50) NOT NULL,
  gender VARCHAR(10),
  age INT,
  class_name VARCHAR(50),
  height DOUBLE,
  weight DOUBLE,
  score DOUBLE
);

CREATE TABLE auth_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_refresh_token (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token_id VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

INSERT INTO stu_info (stu_no, stu_name, gender, age, class_name, height, weight, score)
VALUES
('S2025001', '张三', '男', 18, '高三1班', 175.5, 68.2, 85.5),
('S2025002', '李四', '女', 17, '高三1班', 162.3, 52.1, 92.0),
('S2025003', '王五', '男', 18, '高三2班', 180.0, 75.3, 78.5),
('S2025004', '赵六', '女', 17, '高三2班', 158.6, 48.7, 89.5),
('S2025005', '钱七', '男', 18, '高三1班', 172.8, 65.9, 81.0);

INSERT INTO auth_user (username, password_hash, display_name)
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '系统管理员');
