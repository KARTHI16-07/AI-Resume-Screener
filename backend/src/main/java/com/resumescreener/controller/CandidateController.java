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
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Candidates", description = "Candidate Management APIs")
public class CandidateController {

    @PostMapping(value = "/job/{jobId}/apply", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Candidate applies to a job")
    public ResponseEntity<ApiResponse<CandidateResponse>> applyForJob(
            @PathVariable Long jobId,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication authentication) {
        
        CandidateResponse response = candidateService.applyForJob(jobId, name, email, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Applied successfully", response));
    }
    
    @GetMapping("/my-applications")
    @Operation(summary = "Get jobs the current candidate has applied to")
    public ResponseEntity<ApiResponse<List<Long>>> getMyApplications(org.springframework.security.core.Authentication authentication) {
        List<Long> jobIds = candidateService.getAppliedJobIdsByEmail(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications retrieved", jobIds));
    }


    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    
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

}

    @PostMapping(value = "/jobs/{jobId
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

}/candidates/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload resumes for a job")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> uploadResumes(
            @PathVariable Long jobId,
            @RequestParam("files") List<MultipartFile> files,
            Authentication authentication) {
        List<CandidateResponse> responses = candidateService.uploadResumes(jobId, files, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Resumes uploaded successfully", responses));
    
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

}

    @GetMapping("/candidates/{id
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

}")
    @Operation(summary = "Get candidate details")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id, Authentication authentication) {
        CandidateResponse candidate = candidateService.getCandidateById(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate retrieved successfully", candidate));
    
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

}

    @DeleteMapping("/candidates/{id
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

}")
    @Operation(summary = "Delete a candidate")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id, Authentication authentication) {
        candidateService.deleteCandidate(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidate deleted successfully", null));
    
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

}

    @GetMapping("/candidates/{id
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

}/resume")
    @Operation(summary = "Download original resume file")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id, Authentication authentication) {
        byte[] fileBytes = candidateService.downloadResume(id, authentication.getName());
        CandidateResponse candidate = candidateService.getCandidateById(id, authentication.getName());
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + candidate.getResumeFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    
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

}
