package com.study.studentphysical.domain.student.dto;

public class FailingWarning {

    private long totalCount;
    private long failingCount;
    private long passingCount;
    private double passRate;

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public long getFailingCount() {
        return failingCount;
    }

    public void setFailingCount(long failingCount) {
        this.failingCount = failingCount;
    }

    public long getPassingCount() {
        return passingCount;
    }

    public void setPassingCount(long passingCount) {
        this.passingCount = passingCount;
    }

    public double getPassRate() {
        return passRate;
    }

    public void setPassRate(double passRate) {
        this.passRate = passRate;
    }
}
