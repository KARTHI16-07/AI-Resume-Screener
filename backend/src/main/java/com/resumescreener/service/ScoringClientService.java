package com.resumescreener.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumescreener.entity.ScoreResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScoringClientService {

    private final String scoringServiceUrl;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ScoringClientService(@Value("${app.scoring.service-url}") String scoringServiceUrl) {
        this.scoringServiceUrl = scoringServiceUrl;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public ScoreResult scoreResume(Long candidateId, String jobDescription, String jobRequirements, String resumeText) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Combine description and requirements into a single text for the scoring service
            String combinedJobText = jobDescription;
            if (jobRequirements != null && !jobRequirements.isBlank()) {
                combinedJobText += "\n\nRequirements:\n" + jobRequirements;
            }

            Map<String, String> body = new HashMap<>();
            body.put("job_description", combinedJobText);
            body.put("resume_text", resumeText);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(scoringServiceUrl + "/score", request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                
                Double score = (Double) data.getOrDefault("score", 0.0);
                String explanation = (String) data.getOrDefault("explanation", "");
                
                List<String> matched = (List<String>) data.get("matched_terms");
                List<String> missing = (List<String>) data.get("missing_terms");

                String matchedTermsJson = objectMapper.writeValueAsString(matched);
                String missingTermsJson = objectMapper.writeValueAsString(missing);

                return new ScoreResult(candidateId, score, matchedTermsJson, missingTermsJson, explanation, LocalDateTime.now());
            }

        } catch (Exception e) {
            System.err.println("Scoring service failed: " + e.getMessage());
        }

        // Fallback if scoring fails
        return new ScoreResult(candidateId, -1.0, "[]", "[]", "Scoring unavailable", LocalDateTime.now());
    }
}
