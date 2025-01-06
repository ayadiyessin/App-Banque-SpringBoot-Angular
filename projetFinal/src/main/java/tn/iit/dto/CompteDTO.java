package tn.iit.dto;

import tn.iit.entity.Compte;

public class CompteDTO {
	private Long id;
	private String numeroCompte;
	private String typeCompte;
	private Double solde;
	private Long clientId;

	public Long getId() {
		return id;
	}

	public String getNumeroCompte() {
		return numeroCompte;
	}

	public void setNumeroCompte(String numeroCompte) {
		this.numeroCompte = numeroCompte;
	}

	public String getTypeCompte() {
		return typeCompte;
	}

	public void setTypeCompte(String typeCompte) {
		this.typeCompte = typeCompte;
	}

	public Double getSolde() {
		return solde;
	}

	public void setSolde(Double solde) {
		this.solde = solde;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public CompteDTO() {

	}

	public CompteDTO(Compte compte) {
		this.id = compte.getId();
		this.numeroCompte = compte.getNumeroCompte();
		this.typeCompte = compte.getTypeCompte();
		this.solde = compte.getSolde();
		this.clientId = compte.getClient().getId();
	}
}
