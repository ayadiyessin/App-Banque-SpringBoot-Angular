package tn.iit.dto;


import java.util.Date;

import tn.iit.entity.Transaction;

public class TransactionDTO {
	private Long id;
    private Date dateTransaction;
    private Double montant;
    private String typeTransaction;
    private Long compteId;
    
	public Date getDateTransaction() {
		return dateTransaction;
	}
	public void setDateTransaction(Date dateTransaction) {
		this.dateTransaction = dateTransaction;
	}
	public Double getMontant() {
		return montant;
	}
	public void setMontant(Double montant) {
		this.montant = montant;
	}
	public String getTypeTransaction() {
		return typeTransaction;
	}
	public void setTypeTransaction(String typeTransaction) {
		this.typeTransaction = typeTransaction;
	}
	public Long getCompteId() {
		return compteId;
	}
	public void setCompteId(Long compteId) {
		this.compteId = compteId;
	}
	public Long getId() {
		return id;
	}
	public TransactionDTO() {

	}
    
	public TransactionDTO(Transaction transaction) {
        this.id = transaction.getId();
        this.dateTransaction = transaction.getDateTransaction();
        this.montant = transaction.getMontant();
        this.typeTransaction = transaction.getTypeTransaction();
        this.compteId = transaction.getCompte() != null ? transaction.getCompte().getId() : null;
    }
}
