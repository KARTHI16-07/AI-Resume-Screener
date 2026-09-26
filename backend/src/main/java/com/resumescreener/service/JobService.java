package com.resumescreener.service;

import com.resumescreener.dto.request.JobRequest;
import com.resumescreener.dto.response.JobResponse;
import com.resumescreener.entity.Job;
import com.resumescreener.entity.User;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.CandidateRepository;
import com.resumescreener.repository.JobRepository;
import com.resumescreener.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository, CandidateRepository candidateRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
    }

    public JobResponse createJob(JobRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = new Job(request.getTitle(), request.getDescription(), request.getRequirements(), user.getId(), LocalDateTime.now());
        job = jobRepository.save(job);
        
        return mapToResponse(job, 0);
    }

    
    public List<JobResponse> getAllPublicJobs() {
        return jobRepository.findAll().stream()
                .map(job -> new JobResponse(job.getId(), job.getTitle(), job.getDescription(), job.getRequirements(), job.getCreatedAt(), job.getUpdatedAt()))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<JobResponse> getAllJobsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Job> jobs = jobRepository.findByUserId(user.getId());
        return jobs.stream()
                .map(job -> {
                    int count = candidateRepository.findByJobId(job.getId()).size();
                    return mapToResponse(job, count);
                })
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id, String userEmail) {
        Job job = getJobOwnedByUser(id, userEmail);
        int count = candidateRepository.findByJobId(job.getId()).size();
        return mapToResponse(job, count);
    }

    public JobResponse updateJob(Long id, JobRequest request, String userEmail) {
        Job job = getJobOwnedByUser(id, userEmail);
        
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setUpdatedAt(LocalDateTime.now());
        
        job = jobRepository.save(job);
        int count = candidateRepository.findByJobId(job.getId()).size();
        return mapToResponse(job, count);
    }

    public void deleteJob(Long id, String userEmail) {
        Job job = getJobOwnedByUser(id, userEmail);
        // Note: candidates and score results will be cascade deleted by DB constraints or we can explicitly delete candidates
        jobRepository.delete(job);
    }

    private Job getJobOwnedByUser(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
                
        if (!job.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to job");
        }
        
        return job;
    }

    private JobResponse mapToResponse(Job job, int candidateCount) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        response.setCandidateCount(candidateCount);
        response.setCreatedAt(job.getCreatedAt());
        return response;
    }
}

