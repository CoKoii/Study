# Student Physical SSM

学生体测管理系统，项目按前后端拆分：

- `backend/`: SSM + Maven + Tomcat 后端
- `frontend/`: Vue 3 + Vite 前端
- `docker/`: MySQL 初始化脚本等基础设施文件
- `docker-compose.yml`: 本地 MySQL 与后端服务编排

## Run Backend

```bash
docker compose up -d --build
```

后端接口地址：

```text
http://localhost:8080/stu_pysical_ssm/api
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```
