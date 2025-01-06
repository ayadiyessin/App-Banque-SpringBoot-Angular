package tn.iit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.iit.entity.Transaction;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByCompteId(Long compteId);
}
