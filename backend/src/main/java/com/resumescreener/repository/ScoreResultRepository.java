package com.resumescreener.repository;

import com.resumescreener.entity.ScoreResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScoreResultRepository extends JpaRepository<ScoreResult, Long> {
    Optional<ScoreResult> findByCandidateId(Long candidateId);
}
