package tn.iit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.iit.entity.Utilisateur;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
	Optional<Utilisateur> findByUsername(String username);
}
