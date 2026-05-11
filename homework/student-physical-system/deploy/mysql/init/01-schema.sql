DROP DATABASE IF EXISTS student;
CREATE DATABASE student DEFAULT CHARACTER SET utf8mb4;
USE student;

DROP TABLE IF EXISTS stu_info;

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

INSERT INTO stu_info (stu_no, stu_name, gender, age, class_name, height, weight, score)
VALUES
('S2025001', '张三', '男', 18, '高三1班', 175.5, 68.2, 85.5),
('S2025002', '李四', '女', 17, '高三1班', 162.3, 52.1, 92.0),
('S2025003', '王五', '男', 18, '高三2班', 180.0, 75.3, 78.5),
('S2025004', '赵六', '女', 17, '高三2班', 158.6, 48.7, 89.5),
('S2025005', '钱七', '男', 18, '高三1班', 172.8, 65.9, 81.0);
