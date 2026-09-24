package com.resumescreener.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class CandidateResponse {
    private Long id;
    private String name;
    private String email;
    private String resumeFileName;
    private Double score;
    private List<String> matchedTerms;
    private List<String> missingTerms;
    private String explanation;
    private LocalDateTime uploadedAt;

    public CandidateResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public List<String> getMatchedTerms() { return matchedTerms; }
    public void setMatchedTerms(List<String> matchedTerms) { this.matchedTerms = matchedTerms; }
    public List<String> getMissingTerms() { return missingTerms; }
    public void setMissingTerms(List<String> missingTerms) { this.missingTerms = missingTerms; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
