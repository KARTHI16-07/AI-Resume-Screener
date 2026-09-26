package com.resumescreener.controller;

import com.resumescreener.dto.response.ApiResponse;
import com.resumescreener.dto.response.CandidateResponse;
import com.resumescreener.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidates", description = "Candidate Management APIs")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get candidate by ID")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id, Authentication authentication) {
        CandidateResponse candidate = candidateService.getCandidateById(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate retrieved successfully", candidate));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete candidate")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id, Authentication authentication) {
        candidateService.deleteCandidate(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate deleted successfully", null));
    }

    @GetMapping("/{id}/resume")
    @Operation(summary = "Download candidate resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id, Authentication authentication) {
        byte[] data = candidateService.downloadResume(id, authentication.getName()); return ResponseEntity.ok().header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"resume\"").body(data);
    }

    @PostMapping("/{id}/reply")
    @Operation(summary = "Send email reply to a candidate")
    public ResponseEntity<ApiResponse<Void>> replyToCandidate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        System.out.println("====== SENDING EMAIL ======");
        System.out.println("To Candidate ID: " + id);
        System.out.println("Subject: " + request.get("subject"));
        System.out.println("Message: " + request.get("message"));
        System.out.println("===========================");
        return ResponseEntity.ok(new ApiResponse<>(true, "Email sent successfully", null));
    }
    
    @PostMapping("/job/{jobId}/reply-all")
    @Operation(summary = "Send email to all candidates for a job")
    public ResponseEntity<ApiResponse<Void>> replyToAll(@PathVariable Long jobId, @RequestBody Map<String, String> request) {
        System.out.println("====== SENDING EMAIL TO ALL CANDIDATES FOR JOB " + jobId + " ======");
        System.out.println("Subject: " + request.get("subject"));
        System.out.println("Message: " + request.get("message"));
        System.out.println("==========================================================");
        return ResponseEntity.ok(new ApiResponse<>(true, "Emails sent successfully to all candidates", null));
    }

    @PostMapping(value = "/job/{jobId}/apply", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Candidate applies to a job")
    public ResponseEntity<ApiResponse<CandidateResponse>> applyForJob(
            @PathVariable Long jobId,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        CandidateResponse response = candidateService.applyForJob(jobId, name, email, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Applied successfully", response));
    }
    
    @GetMapping("/my-applications")
    @Operation(summary = "Get jobs the current candidate has applied to")
    public ResponseEntity<ApiResponse<List<Long>>> getMyApplications(Authentication authentication) {
        List<Long> jobIds = candidateService.getAppliedJobIdsByEmail(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications retrieved", jobIds));
    }
}


