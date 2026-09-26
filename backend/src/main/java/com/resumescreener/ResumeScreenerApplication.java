package com.resumescreener;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ResumeScreenerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResumeScreenerApplication.class, args);
    }

    @Bean
    public CommandLineRunner autoMigrateDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Check if role column exists and add it if missing
                String sql = "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'RECRUITER';";
                jdbcTemplate.execute(sql);
                System.out.println("? Database schema auto-migration successful: 'role' column checked/added.");
            } catch (Exception e) {
                System.out.println("?? Could not auto-migrate database (it may already be correct): " + e.getMessage());
            }
        };
    }
}
