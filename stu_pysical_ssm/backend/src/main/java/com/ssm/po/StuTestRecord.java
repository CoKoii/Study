package com.ssm.po;

import java.util.Date;

public class StuTestRecord {
    private Long id;
    private String stuNo;
    private String term;
    private Double height;
    private Double weight;
    private Double bmi;
    private Double scoreTotal;
    private String warningTag;
    private Date createdAt;
    private Date updatedAt;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStuNo() { return stuNo; }
    public void setStuNo(String stuNo) { this.stuNo = stuNo; }
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public Double getScoreTotal() { return scoreTotal; }
    public void setScoreTotal(Double scoreTotal) { this.scoreTotal = scoreTotal; }
    public String getWarningTag() { return warningTag; }
    public void setWarningTag(String warningTag) { this.warningTag = warningTag; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}