package com.resumescreener.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumescreener.dto.response.CandidateResponse;
import com.resumescreener.entity.Candidate;
import com.resumescreener.entity.Job;
import com.resumescreener.entity.ScoreResult;
import com.resumescreener.entity.User;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.CandidateRepository;
import com.resumescreener.repository.JobRepository;
import com.resumescreener.repository.ScoreResultRepository;
import com.resumescreener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ScoreResultRepository scoreResultRepository;
    private final ResumeParserService resumeParserService;
    private final ScoringClientService scoringClientService;
    private final ObjectMapper objectMapper;
    private final String uploadDir;

    public CandidateService(CandidateRepository candidateRepository, JobRepository jobRepository, UserRepository userRepository, ScoreResultRepository scoreResultRepository, ResumeParserService resumeParserService, ScoringClientService scoringClientService, @Value("${app.upload.dir}") String uploadDir) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.scoreResultRepository = scoreResultRepository;
        this.resumeParserService = resumeParserService;
        this.scoringClientService = scoringClientService;
        this.objectMapper = new ObjectMapper();
        this.uploadDir = uploadDir;
        
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public List<CandidateResponse> uploadResumes(Long jobId, List<MultipartFile> files, String userEmail) {
        Job job = verifyJobOwnership(jobId, userEmail);

        return files.parallelStream().map(file -> {
            if (file.isEmpty()) return null;

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String newFileName = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadDir, newFileName);
            
            try {
                Files.copy(file.getInputStream(), filePath);
                File savedFile = filePath.toFile();
                
                String extractedText = resumeParserService.extractText(savedFile);
                
                String name = extractName(extractedText, originalFilename);
                String email = extractEmail(extractedText);
                
                Candidate candidate = new Candidate(name, email, originalFilename, filePath.toAbsolutePath().toString(), file.getContentType(), extractedText, job.getId(), LocalDateTime.now());
                candidate = candidateRepository.save(candidate);
                
                ScoreResult scoreResult = scoringClientService.scoreResume(candidate.getId(), job.getDescription(), job.getRequirements(), extractedText);
                scoreResultRepository.save(scoreResult);
                
                return mapToResponse(candidate, scoreResult);
            } catch (IOException e) {
                System.err.println("Failed to save file: " + e.getMessage());
                return null;
            }
        }).filter(java.util.Objects::nonNull).collect(Collectors.toList());
    }

    
    private String extractEmail(String text) {
        if (text == null) return "unknown@example.com";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
        java.util.regex.Matcher m = p.matcher(text);
        if (m.find()) return m.group();
        return "unknown@example.com";
    }

    private String extractName(String text, String filename) {
        if (text != null && !text.trim().isEmpty()) {
            String[] lines = text.trim().split("\\r?\\n");
            for (String line : lines) {
                line = line.trim();
                if (line.length() > 2 && line.length() < 50 && !line.toLowerCase().contains("resume") && !line.toLowerCase().contains("curriculum vitae")) {
                    return line;
                }
            }
        }
        if (filename != null && filename.contains(".")) {
            return filename.substring(0, filename.lastIndexOf("."));
        }
        return "Candidate";
    }

    public List<CandidateResponse> getCandidatesByJob(Long jobId, String userEmail) {
        verifyJobOwnership(jobId, userEmail);
        List<Candidate> candidates = candidateRepository.findByJobId(jobId);
        
        return candidates.stream().map(c -> {
            Optional<ScoreResult> score = scoreResultRepository.findByCandidateId(c.getId());
            return mapToResponse(c, score.orElse(null));
        }).sorted((c1, c2) -> Double.compare(c2.getScore() != null ? c2.getScore() : 0.0, c1.getScore() != null ? c1.getScore() : 0.0))
        .collect(Collectors.toList());
    }

    public CandidateResponse getCandidateById(Long id, String userEmail) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        verifyJobOwnership(candidate.getJobId(), userEmail);
        
        ScoreResult score = scoreResultRepository.findByCandidateId(candidate.getId()).orElse(null);
        return mapToResponse(candidate, score);
    }

    public void deleteCandidate(Long id, String userEmail) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        verifyJobOwnership(candidate.getJobId(), userEmail);
        
        File file = new File(candidate.getResumeFilePath());
        if (file.exists()) {
            file.delete();
        }
        
        candidateRepository.delete(candidate);
    }

    public byte[] downloadResume(Long id, String userEmail) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        verifyJobOwnership(candidate.getJobId(), userEmail);
        
        try {
            return Files.readAllBytes(Paths.get(candidate.getResumeFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("Could not read file");
        }
    }

    private Job verifyJobOwnership(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
                
        if (!job.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to job");
        }
        return job;
    }

    private CandidateResponse mapToResponse(Candidate candidate, ScoreResult scoreResult) {
        CandidateResponse response = new CandidateResponse();
        response.setId(candidate.getId());
        response.setName(candidate.getName());
        response.setEmail(candidate.getEmail());
        response.setResumeFileName(candidate.getResumeFileName());
        response.setUploadedAt(candidate.getUploadedAt());
        
        if (scoreResult != null) {
            response.setScore(scoreResult.getScore());
            response.setExplanation(scoreResult.getExplanation());
            try {
                List<String> matched = objectMapper.readValue(scoreResult.getMatchedTerms(), new TypeReference<List<String>>(){});
                List<String> missing = objectMapper.readValue(scoreResult.getMissingTerms(), new TypeReference<List<String>>(){});
                response.setMatchedTerms(matched);
                response.setMissingTerms(missing);
            } catch (Exception e) {
                response.setMatchedTerms(new ArrayList<>());
                response.setMissingTerms(new ArrayList<>());
            }
        }
        
        return response;
    }
}

