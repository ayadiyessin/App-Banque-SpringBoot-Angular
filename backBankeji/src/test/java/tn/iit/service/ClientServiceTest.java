package tn.iit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tn.iit.dto.ClientDTO;
import tn.iit.entity.Client;
import tn.iit.exception.ClientNotFoundException;
import tn.iit.repository.ClientRepository;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

	@Mock
	private ClientRepository clientRepository;

	@InjectMocks
	private ClientService clientService;

	@Test
	void save_ShouldReturnSavedClientDTO() {
		// Arrange
		ClientDTO inputDto = new ClientDTO();
		inputDto.setNom("Nom");
		inputDto.setEmail("test@test.com");

		Client savedClient = inputDto.toEntity();
		when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

		// Act
		ClientDTO result = clientService.save(inputDto);

		// Assert
		assertNotNull(result);
		assertEquals(inputDto.getNom(), result.getNom());
		verify(clientRepository).save(any(Client.class));
	}

	@Test
	void getById_ShouldThrowException_WhenClientNotFound() {
		// Arrange
		when(clientRepository.findById(1L)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(ClientNotFoundException.class, () -> clientService.getById(1L));
	}

	@Test
	void findAll_ShouldReturnAllClients() {
		// Arrange
		Client client1 = new Client();
		client1.setNom("Client1");
		Client client2 = new Client();
		client2.setNom("Client2");
		when(clientRepository.findAll()).thenReturn(Arrays.asList(client1, client2));

		// Act
		List<ClientDTO> result = clientService.findAll();

		// Assert
		assertEquals(2, result.size());
		verify(clientRepository).findAll();
	}

	@Test
	void update_ShouldUpdateClient_WhenClientExists() {
		// Arrange
		Long id = 1L;
		Client existingClient = new Client();
		existingClient.setId(id);

		ClientDTO updateDto = new ClientDTO();
		updateDto.setNom("Updated");

		when(clientRepository.findById(id)).thenReturn(Optional.of(existingClient));
		when(clientRepository.save(any(Client.class))).thenReturn(existingClient);

		// Act
		ClientDTO result = clientService.update(id, updateDto);

		// Assert
		assertEquals(updateDto.getNom(), result.getNom());
		verify(clientRepository).save(any(Client.class));
	}
}