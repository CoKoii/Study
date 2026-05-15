package com.ssm.dto;

public class StudentStatisticsResponse {
    private String overallAverageScore;
    private GenderSummary male;
    private GenderSummary female;

    public StudentStatisticsResponse() {
    }

    public StudentStatisticsResponse(String overallAverageScore, GenderSummary male, GenderSummary female) {
        this.overallAverageScore = overallAverageScore;
        this.male = male;
        this.female = female;
    }

    public String getOverallAverageScore() {
        return overallAverageScore;
    }

    public void setOverallAverageScore(String overallAverageScore) {
        this.overallAverageScore = overallAverageScore;
    }

    public GenderSummary getMale() {
        return male;
    }

    public void setMale(GenderSummary male) {
        this.male = male;
    }

    public GenderSummary getFemale() {
        return female;
    }

    public void setFemale(GenderSummary female) {
        this.female = female;
    }

    public static class GenderSummary {
        private String averageScore;
        private String averageBmi;
        private int failedCount;

        public GenderSummary() {
        }

        public GenderSummary(String averageScore, String averageBmi, int failedCount) {
            this.averageScore = averageScore;
            this.averageBmi = averageBmi;
            this.failedCount = failedCount;
        }

        public String getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(String averageScore) {
            this.averageScore = averageScore;
        }

        public String getAverageBmi() {
            return averageBmi;
        }

        public void setAverageBmi(String averageBmi) {
            this.averageBmi = averageBmi;
        }

        public int getFailedCount() {
            return failedCount;
        }

        public void setFailedCount(int failedCount) {
            this.failedCount = failedCount;
        }
    }
}
