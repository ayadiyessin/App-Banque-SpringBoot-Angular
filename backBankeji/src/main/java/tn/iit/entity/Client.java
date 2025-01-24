package tn.iit.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.ToString.Exclude;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Entity
@Table(name = "t_client")
public class Client implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nom;
	private String prenom;
	private String email;
	private String telephone;
	private String adresse;
	@JsonIgnore
	@Exclude
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL , orphanRemoval = true)
	private List<Compte> comptes;

	public Client(String nom, String prenom, String email, String telephone, String adresse) {
		super();
		this.nom = nom;
		this.prenom = prenom;
		this.email = email;
		this.telephone = telephone;
		this.adresse = adresse;

	}

	public String getNomComplet() {
		return nom + " " + prenom;
	}
}