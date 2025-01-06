package tn.iit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tn.iit.entity.Compte;

public interface CompteRepository extends JpaRepository<Compte, Long> {
	List<Compte> findByClientId(Long clientId);
	
	@Query("select c from Compte c where c.numeroCompte = :numero")
    Optional<Compte> findByNumeroCompte(@Param("numero") String numeroCompte);
}
