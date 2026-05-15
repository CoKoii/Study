FROM maven:3.9.9-eclipse-temurin-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B package -DskipTests

FROM tomcat:9.0-jdk8-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /app/target/stu_pysical_ssm.war /usr/local/tomcat/webapps/stu_pysical_ssm.war
EXPOSE 8080
