package tn.iit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.iit.dto.TransactionDTO;
import tn.iit.entity.Compte;
import tn.iit.entity.Transaction;
import tn.iit.exception.CompteNotFoundException;
import tn.iit.exception.TransactionNotFoundException;
import tn.iit.repository.CompteRepository;
import tn.iit.repository.TransactionRepository;

@RequiredArgsConstructor
@Transactional
@Service
public class TransactionService {
	private final TransactionRepository transactionRepository;
	private final CompteRepository compteRepository;

	public TransactionDTO save(TransactionDTO transactionDTO) {
		Compte compte = compteRepository.findById(transactionDTO.getCompteId()).orElseThrow(
				() -> new CompteNotFoundException("compte with id= " + transactionDTO.getCompteId() + " is not found"));
		Transaction transaction = new Transaction();
		transaction.setDateTransaction(transactionDTO.getDateTransaction());
		transaction.setMontant(transactionDTO.getMontant());
		transaction.setTypeTransaction(transactionDTO.getTypeTransaction());
		transaction.setCompte(compte);
		transaction = transactionRepository.save(transaction);
		return new TransactionDTO(transaction);
	}


	public List<TransactionDTO> findAll() {
		return transactionRepository.findAll().stream().map(TransactionDTO::new).collect(Collectors.toList());
	}

	public List<TransactionDTO> getAllTransactionByCompte(Long compteId) {
		return transactionRepository.findByCompteId(compteId).stream().map(TransactionDTO::new)
				.collect(Collectors.toList());
	}


	public TransactionDTO getById(Long id) {
		Transaction transaction = transactionRepository.findById(id)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction with id= " + id + " is Not Found"));
		return new TransactionDTO(transaction);
	}

}
