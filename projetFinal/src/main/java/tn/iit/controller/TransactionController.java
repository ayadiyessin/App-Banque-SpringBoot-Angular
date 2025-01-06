package tn.iit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tn.iit.dto.TransactionDTO;
import tn.iit.service.TransactionService;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/transactions")
public class TransactionController {
	private final TransactionService transactionService;

	@GetMapping({ "/", "/all" })
	public List<TransactionDTO> findAll() {
		return transactionService.findAll();
	}

	@GetMapping("/ByCompte/{id}")
	public List<TransactionDTO> getAllTransactionByCompte(@PathVariable("id") Long compteId) {
		return transactionService.getAllTransactionByCompte(compteId);
	}

	@PostMapping("/save")
	public TransactionDTO save(@RequestBody TransactionDTO transactionDTO) {
		return transactionService.save(transactionDTO);
	}


	@GetMapping("/getById/{id}")
	public TransactionDTO getById(@PathVariable("id") Long id) {
		return transactionService.getById(id);
	}

}
