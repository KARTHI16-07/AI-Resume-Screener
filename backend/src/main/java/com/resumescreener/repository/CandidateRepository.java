package com.resumescreener.repository;

import com.resumescreener.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByJobId(Long jobId);
    void deleteByJobId(Long jobId);
}
