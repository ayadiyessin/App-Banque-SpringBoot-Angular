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
import tn.iit.dto.CompteDTO;
import tn.iit.service.CompteService;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/comptes")
public class CompteController {
	private final CompteService compteService;

	@GetMapping({ "/", "/all" })
	public List<CompteDTO> findAll() {
		return compteService.findAll();
	}
	
	@GetMapping("/ByClient/{id}")
    public List<CompteDTO> getAllCompteByClient(@PathVariable("id") Long clientId) {
        return compteService.getAllCompteByClient(clientId);
    }
	
	@GetMapping("/ByNumeroCompte/{numeroCompte}")
    public List<CompteDTO> getCompteByNumeroCompte(@PathVariable("numeroCompte") String numeroCompte) {
        return compteService.getCompteByNumeroCompte(numeroCompte);
    }
	
	@PostMapping("/save")
	public CompteDTO save(@RequestBody CompteDTO compteDTO) {
		return compteService.save(compteDTO);
	}

	@PostMapping("/delete-ajax")
	public void deleteAjax(@RequestParam Long id) {
		compteService.delete(id);
	}

	@GetMapping("/getById/{id}")
	public CompteDTO getById(@PathVariable("id") Long id) {
		return compteService.getById(id);
	}

	@PutMapping("/update/{id}")
	public CompteDTO update(@PathVariable("id") Long id, @RequestBody CompteDTO compteDTO) {
		return compteService.update(id, compteDTO);
	}
}
