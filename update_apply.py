import os

with open('backend/src/main/java/com/resumescreener/controller/CandidateController.java', 'r') as f: content = f.read()
if '@PostMapping("/apply")' not in content:
    apply_endpoint = """
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
"""
    content = content.replace('public class CandidateController {', 'public class CandidateController {\n' + apply_endpoint)
    with open('backend/src/main/java/com/resumescreener/controller/CandidateController.java', 'w') as f: f.write(content)

with open('backend/src/main/java/com/resumescreener/service/CandidateService.java', 'r') as f: content = f.read()
if 'public CandidateResponse applyForJob' not in content:
    service_method = """
    public CandidateResponse applyForJob(Long jobId, String name, String email, MultipartFile file) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadDir, newFileName);
            Files.copy(file.getInputStream(), filePath);
            
            String extractedText = resumeParserService.extractText(filePath.toFile());
            
            Candidate candidate = new Candidate(name, email, originalFilename, filePath.toAbsolutePath().toString(), file.getContentType(), extractedText, job.getId(), LocalDateTime.now());
            candidate = candidateRepository.save(candidate);
            
            ScoreResult scoreResult = scoringClientService.scoreResume(candidate.getId(), job.getDescription(), job.getRequirements(), extractedText);
            scoreResultRepository.save(scoreResult);
            
            return mapToResponse(candidate, scoreResult);
        } catch (Exception e) {
            throw new RuntimeException("Failed to apply for job: " + e.getMessage());
        }
    }
    
    public List<Long> getAppliedJobIdsByEmail(String email) {
        return candidateRepository.findAll().stream()
                .filter(c -> email.equalsIgnoreCase(c.getEmail()))
                .map(Candidate::getJobId)
                .distinct()
                .collect(Collectors.toList());
    }
"""
    content = content.replace('public List<CandidateResponse> getCandidatesByJob', service_method + '\n    public List<CandidateResponse> getCandidatesByJob')
    with open('backend/src/main/java/com/resumescreener/service/CandidateService.java', 'w') as f: f.write(content)

print("Apply endpoints added")
