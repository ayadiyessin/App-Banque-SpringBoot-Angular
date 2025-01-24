package tn.iit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.iit.dto.CompteDTO;
import tn.iit.entity.Client;
import tn.iit.entity.Compte;
import tn.iit.exception.ClientNotFoundException;
import tn.iit.exception.CompteNotFoundException;
import tn.iit.repository.ClientRepository;
import tn.iit.repository.CompteRepository;

@RequiredArgsConstructor
@Transactional
@Service
public class CompteService {
	private final CompteRepository compteRepository;
	private final ClientRepository clientRepository;

	public CompteDTO save(CompteDTO compteDTO) {
		Client client = clientRepository.findById(compteDTO.getClientId()).orElseThrow(
				() -> new ClientNotFoundException("Client with id= " + compteDTO.getClientId() + " is not found"));
		Compte compte = new Compte();
		compte.setNumeroCompte(compteDTO.getNumeroCompte());
		compte.setTypeCompte(compteDTO.getTypeCompte());
		compte.setSolde(compteDTO.getSolde());
		compte.setClient(client);
		compte = compteRepository.save(compte);
		return new CompteDTO(compte);
	}

	public CompteDTO update(Long id, CompteDTO compteDTO) {
		Compte compte = compteRepository.findById(id)
				.orElseThrow(() -> new CompteNotFoundException("Compte with id= " + id + " is Not Found"));
		Client client = clientRepository.findById(compteDTO.getClientId()).orElseThrow(
				() -> new ClientNotFoundException("Client with id= " + compteDTO.getClientId() + " is not found"));
		compte.setNumeroCompte(compteDTO.getNumeroCompte());
		compte.setTypeCompte(compteDTO.getTypeCompte());
		compte.setSolde(compteDTO.getSolde());
		compte.setClient(client);
		compte = compteRepository.save(compte);
		return new CompteDTO(compte);
	}

	public List<CompteDTO> findAll() {
		return compteRepository.findAll().stream().map(CompteDTO::new).collect(Collectors.toList());
	}

	public List<CompteDTO> getAllCompteByClient(Long clientId) {
		return compteRepository.findByClientId(clientId).stream().map(CompteDTO::new).collect(Collectors.toList());
	}

	public void delete(Long id) {
		compteRepository.deleteById(id);
	}

	public CompteDTO getById(Long id) {
		Compte compte = compteRepository.findById(id)
				.orElseThrow(() -> new CompteNotFoundException("Compte with id= " + id + " is Not Found"));
		return new CompteDTO(compte);
	}
	public List<CompteDTO> getCompteByNumeroCompte(String numeroCompte) {
		return compteRepository.findByNumeroCompte(numeroCompte)
								.stream()
								.map(CompteDTO::new)
								.collect(Collectors.toList());
	}

}
