package tn.iit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.iit.dto.ClientDTO;
import tn.iit.entity.Client;
import tn.iit.exception.ClientNotFoundException;
import tn.iit.repository.ClientRepository;

@RequiredArgsConstructor
@Transactional
@Service
public class ClientService {
	private final ClientRepository clientRepository;

	public ClientDTO save(ClientDTO clientDTO) {
		Client client = clientDTO.toEntity();
		client = clientRepository.save(client);
		return new ClientDTO(client);
	}

	public ClientDTO update(Long id, ClientDTO clientDTO) {
		Client client = clientRepository.findById(id)
				.orElseThrow(() -> new ClientNotFoundException("Client with id= " + id + " is Not Found"));
		client.setNom(clientDTO.getNom());
		client.setPrenom(clientDTO.getPrenom());
		client.setEmail(clientDTO.getEmail());
		client.setTelephone(clientDTO.getTelephone());
		client.setAdresse(clientDTO.getAdresse());
		client = clientRepository.save(client);
		return new ClientDTO(client);
	}

	public List<ClientDTO> findAll() {
		return clientRepository.findAll().stream().map(ClientDTO::new).collect(Collectors.toList());
	}

	public void delete(Long id) {
		clientRepository.deleteById(id);
	}

	public ClientDTO getById(Long id) {
		Client client = clientRepository.findById(id)
				.orElseThrow(() -> new ClientNotFoundException("Client with id= " + id + " is Not Found"));
		return new ClientDTO(client);
	}

}
