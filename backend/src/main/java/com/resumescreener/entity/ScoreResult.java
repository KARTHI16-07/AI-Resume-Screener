package com.resumescreener.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "score_result")
public class ScoreResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long candidateId;

    private Double score;

    @Column(columnDefinition = "TEXT")
    private String matchedTerms;

    @Column(columnDefinition = "TEXT")
    private String missingTerms;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false)
    private LocalDateTime scoredAt;

    public ScoreResult() {
    }

    public ScoreResult(Long candidateId, Double score, String matchedTerms, String missingTerms, String explanation, LocalDateTime scoredAt) {
        this.candidateId = candidateId;
        this.score = score;
        this.matchedTerms = matchedTerms;
        this.missingTerms = missingTerms;
        this.explanation = explanation;
        this.scoredAt = scoredAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getMatchedTerms() {
        return matchedTerms;
    }

    public void setMatchedTerms(String matchedTerms) {
        this.matchedTerms = matchedTerms;
    }

    public String getMissingTerms() {
        return missingTerms;
    }

    public void setMissingTerms(String missingTerms) {
        this.missingTerms = missingTerms;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public LocalDateTime getScoredAt() {
        return scoredAt;
    }

    public void setScoredAt(LocalDateTime scoredAt) {
        this.scoredAt = scoredAt;
    }
}
