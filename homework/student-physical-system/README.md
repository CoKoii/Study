# 学生体质信息管理系统

基于课程文档实现的前后端分离作业项目。

技术栈：

- 前端：Vue 3 + Vite + Axios
- 后端：Spring Boot + MyBatis + MySQL
- 部署：Docker Compose

## 功能范围

按文档完成学生基础体质信息管理：

- 学生列表查询
- 按学号或姓名关键字检索
- 学生信息新增
- 学生信息编辑
- 学生信息删除
- 当前页数量与平均成绩展示
- 分页查询

未实现 JSP，已按你的要求统一改为 Vue 3 前端。

## 目录结构

```text
student-physical-system
├── backend                     # Spring Boot 后端
│   ├── src/main/java/com/study/studentphysical
│   │   ├── common              # 通用返回体、分页对象
│   │   ├── config              # Web 跨域配置
│   │   ├── domain/student      # 学生模块
│   │   │   ├── controller      # 控制层
│   │   │   ├── dto             # 查询参数
│   │   │   ├── entity          # 实体
│   │   │   ├── mapper          # Mapper 接口
│   │   │   └── service         # 业务层
│   │   └── exception           # 全局异常处理
│   └── src/main/resources
│       └── mapper              # MyBatis XML
├── frontend                    # Vue 3 前端
│   └── src
│       ├── api                 # 接口封装
│       ├── components          # 页面组件
│       └── styles              # 样式
├── deploy/mysql/init           # MySQL 初始化脚本
└── docker-compose.yml          # Docker 编排
```

## 启动方式

### 方式一：推荐，Docker 启动后端和数据库

在项目根目录执行：

```bash
docker compose up --build
```

启动后：

- MySQL：`localhost:3306`
- 后端接口：`http://localhost:8080/api/students`

### 方式二：前端本地启动

在 `frontend` 目录执行：

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:5173
```

前端通过 Vite 代理访问本地 `8080` 端口后端。

## 后端本地运行说明

本机如果安装了 Maven，可以在 `backend` 目录执行：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

当前环境未安装 Maven，所以更适合直接使用 Docker。

## 接口说明

基础路径：`/api/students`

- `GET /api/students`：分页查询，支持 `keyword`、`pageNum`、`pageSize`
- `GET /api/students/{stuNo}`：按学号查询
- `POST /api/students`：新增学生
- `PUT /api/students/{stuNo}`：修改学生
- `DELETE /api/students/{stuNo}`：删除学生

统一返回格式：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {}
}
```

## 页面风格说明

已按要求处理为简约企业风：

- 去掉阴影
- 不使用彩色渐变
- 以白底、灰边、深色主按钮为主
- 保持模块化和后台管理系统风格
