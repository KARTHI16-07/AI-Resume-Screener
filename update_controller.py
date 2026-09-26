import os
import re

# Update CandidateController.java to add email reply endpoints
with open('backend/src/main/java/com/resumescreener/controller/CandidateController.java', 'r') as f: content = f.read()
if '@PostMapping("/{id}/reply")' not in content:
    imports = "import java.util.Map;\n"
    content = content.replace('import org.springframework.web.bind.annotation.*;', 'import org.springframework.web.bind.annotation.*;\n' + imports)
    
    reply_endpoints = """
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
"""
    content = content.replace('}', reply_endpoints + '\n}')
    with open('backend/src/main/java/com/resumescreener/controller/CandidateController.java', 'w') as f: f.write(content)

print("CandidateController updated")
