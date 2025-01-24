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
import tn.iit.dto.ClientDTO;
import tn.iit.service.ClientService;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/clients")
public class ClientController {
	private final ClientService clientService;

	@GetMapping({ "/", "/all" })
	public List<ClientDTO> findAll() {
		return clientService.findAll();
	}

	@PostMapping("/save")
	public ClientDTO save(@RequestBody ClientDTO clientDTO) {
		return clientService.save(clientDTO);
	}

	@PostMapping("/delete-ajax")
	public void deleteAjax(@RequestParam Long id) {
		clientService.delete(id);
	}

	@GetMapping("/getById/{id}")
	public ClientDTO getById(@PathVariable("id") Long id) {
		return clientService.getById(id);
	}

	@PutMapping("/update/{id}")
	public ClientDTO update(@PathVariable("id") Long id, @RequestBody ClientDTO clientDTO) {
		return clientService.update(id, clientDTO);
	}
}
