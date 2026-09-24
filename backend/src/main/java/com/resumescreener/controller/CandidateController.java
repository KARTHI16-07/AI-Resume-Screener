package com.resumescreener.controller;

import com.resumescreener.dto.response.ApiResponse;
import com.resumescreener.dto.response.CandidateResponse;
import com.resumescreener.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Candidates", description = "Candidate Management APIs")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping(value = "/jobs/{jobId}/candidates/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload resumes for a job")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> uploadResumes(
            @PathVariable Long jobId,
            @RequestParam("files") List<MultipartFile> files,
            Authentication authentication) {
        List<CandidateResponse> responses = candidateService.uploadResumes(jobId, files, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Resumes uploaded successfully", responses));
    }

    @GetMapping("/candidates/{id}")
    @Operation(summary = "Get candidate details")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id, Authentication authentication) {
        CandidateResponse candidate = candidateService.getCandidateById(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate retrieved successfully", candidate));
    }

    @DeleteMapping("/candidates/{id}")
    @Operation(summary = "Delete a candidate")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id, Authentication authentication) {
        candidateService.deleteCandidate(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate deleted successfully", null));
    }

    @GetMapping("/candidates/{id}/resume")
    @Operation(summary = "Download original resume file")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id, Authentication authentication) {
        byte[] fileBytes = candidateService.downloadResume(id, authentication.getName());
        CandidateResponse candidate = candidateService.getCandidateById(id, authentication.getName());
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + candidate.getResumeFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }
}
