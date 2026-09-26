package com.resumescreener.controller;

import com.resumescreener.dto.request.JobRequest;
import com.resumescreener.dto.response.ApiResponse;
import com.resumescreener.dto.response.CandidateResponse;
import com.resumescreener.dto.response.JobResponse;
import com.resumescreener.service.CandidateService;
import com.resumescreener.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job Management APIs")
public class JobController {

    private final JobService jobService;
    private final CandidateService candidateService;

    public JobController(JobService jobService, CandidateService candidateService) {
        this.jobService = jobService;
        this.candidateService = candidateService;
    }

    @PostMapping
    @Operation(summary = "Create a new job")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        JobResponse job = jobService.createJob(request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Job created successfully", job));
    }

    @GetMapping("/public")
    @Operation(summary = "Get all jobs publicly")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllPublicJobs() {
        List<JobResponse> jobs = jobService.getAllPublicJobs();
        return ResponseEntity.ok(new ApiResponse<>(true, "Public jobs retrieved successfully", jobs));
    }

    @GetMapping
    @Operation(summary = "Get all jobs for current user")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(Authentication authentication) {
        List<JobResponse> jobs = jobService.getAllJobsByUser(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs retrieved successfully", jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id, Authentication authentication) {
        JobResponse job = jobService.getJobById(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Job retrieved successfully", job));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update job")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request, Authentication authentication) {
        JobResponse job = jobService.updateJob(id, request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Job updated successfully", job));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete job")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Job deleted successfully", null));
    }

    @GetMapping("/{id}/candidates")
    @Operation(summary = "Get all candidates for a job")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getCandidatesByJob(@PathVariable Long id, Authentication authentication) {
        List<CandidateResponse> candidates = candidateService.getCandidatesByJob(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidates retrieved successfully", candidates));
    }
}
