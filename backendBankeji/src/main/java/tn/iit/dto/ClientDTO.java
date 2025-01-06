package tn.iit.dto;

import tn.iit.entity.Client;

public class ClientDTO {
	private Long id;
	private String nom;
	private String prenom;
	private String email;
	private String telephone;
	private String adresse;
	
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getAdresse() {
		return adresse;
	}
	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}
	public Long getId() {
		return id;
	}
	
	public ClientDTO() {
		
	}
	public ClientDTO(Client client) {
	    this.id = client.getId();
	    this.nom = client.getNom();
	    this.prenom = client.getPrenom();
	    this.email = client.getEmail();
	    this.telephone = client.getTelephone();
	    this.adresse = client.getAdresse();
	}
	
	public Client toEntity() {
	    Client client = new Client();
	    client.setId(this.id);
	    client.setNom(this.nom);
	    client.setPrenom(this.prenom);
	    client.setEmail(this.email);
	    client.setTelephone(this.telephone);
	    client.setAdresse(this.adresse);
	    return client;
	}
    
}
