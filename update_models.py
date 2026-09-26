import os
import re

# 1. Update User.java
with open('backend/src/main/java/com/resumescreener/entity/User.java', 'r') as f: content = f.read()
if 'private String role;' not in content:
    content = content.replace('private String fullName;', 'private String fullName;\n    private String role;')
    content = content.replace('public String getFullName()', 'public String getRole() { return role; }\n    public void setRole(String role) { this.role = role; }\n\n    public String getFullName()')
    with open('backend/src/main/java/com/resumescreener/entity/User.java', 'w') as f: f.write(content)

# 2. Update RegisterRequest.java
with open('backend/src/main/java/com/resumescreener/dto/request/RegisterRequest.java', 'r') as f: content = f.read()
if 'private String role;' not in content:
    content = content.replace('private String fullName;', 'private String fullName;\n    private String role;')
    content = content.replace('public String getFullName()', 'public String getRole() { return role; }\n    public void setRole(String role) { this.role = role; }\n\n    public String getFullName()')
    with open('backend/src/main/java/com/resumescreener/dto/request/RegisterRequest.java', 'w') as f: f.write(content)

# 3. Update AuthResponse.java
with open('backend/src/main/java/com/resumescreener/dto/response/AuthResponse.java', 'r') as f: content = f.read()
if 'private String role;' not in content:
    content = content.replace('private String fullName;', 'private String fullName;\n    private String role;')
    content = content.replace('this.fullName = fullName;', 'this.fullName = fullName;\n        this.role = role;')
    content = content.replace('(String token, String email, String fullName)', '(String token, String email, String fullName, String role)')
    content = content.replace('public String getFullName()', 'public String getRole() { return role; }\n\n    public String getFullName()')
    with open('backend/src/main/java/com/resumescreener/dto/response/AuthResponse.java', 'w') as f: f.write(content)

# 4. Update AuthService.java
with open('backend/src/main/java/com/resumescreener/service/AuthService.java', 'r') as f: content = f.read()
if 'user.setRole' not in content:
    content = content.replace('user.setFullName(request.getFullName());', 'user.setFullName(request.getFullName());\n        user.setRole(request.getRole() != null ? request.getRole() : "RECRUITER");')
    content = content.replace('new AuthResponse(token, user.getEmail(), user.getFullName())', 'new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole())')
    with open('backend/src/main/java/com/resumescreener/service/AuthService.java', 'w') as f: f.write(content)

print("Backend Models Updated")
