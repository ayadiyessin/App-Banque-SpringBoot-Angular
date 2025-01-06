import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/Models/Client';
import { Compte } from 'src/Models/Compte';
import { Transaction } from 'src/Models/Transaction';
import { ClientService } from 'src/Services/client.service';
import { CompteService } from 'src/Services/compte.service';
import { TransactionService } from 'src/Services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  dateAujourdui!:string;
  constructor(private activatedRoute: ActivatedRoute, private CS: ClientService, private CPS: CompteService, private TS: TransactionService) {}
  datasource = new MatTableDataSource<Transaction>()
  displayedColumns: string[] = ['id', 'dateTransaction', 'montant', 'typeTransaction'];
  nbTransaction!: number
  TransactionForm!: FormGroup
  idcourant!: string
  compteConcern!: Compte
  clientConcern!: Client
  OnLoud: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModal') closeModal: ElementRef


  ngOnInit(): void {
    const today = new Date();
    this.dateAujourdui = today.toISOString().split('T')[0];
    this.idcourant = this.activatedRoute.snapshot.params['id'];
    this.getAllTransactionByCompte(this.idcourant);
    this.initTransactionForm();
  }

  getAllTransactionByCompte(id: string) {
    this.TS.getAllTransactionByCompte(id).subscribe(dataTrans => {
      this.datasource.data = dataTrans;
      this.nbTransaction = dataTrans.length;
    });
    this.CPS.getByIdCompte(id).subscribe(dataCompte => {
      this.compteConcern = dataCompte;
      this.CS.getByIdClient(this.compteConcern.clientId).subscribe(dataCli => {
        this.clientConcern = dataCli;
        this.OnLoud = true;
      });
    });
  }

  initTransactionForm(): void {
    this.TransactionForm = new FormGroup({
      dateTransaction: new FormControl(this.dateAujourdui, [Validators.required]),
      montant: new FormControl(0, [Validators.required, Validators.pattern(/^\d*[1-9]\d*$/)]),
      typeTransaction: new FormControl(null, [Validators.required]),
      compteId: new FormControl(this.idcourant, [Validators.required])
    })
    console.log('Form Value:', this.TransactionForm.value);

  }

  restrictToNumbers(event: KeyboardEvent): void {
    const key = event.key;
    // Vérifie si la touche n'est pas un chiffre ou une touche de navigation (backspace, delete, flèches, etc.)
    if (!/^\d$/.test(key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
      event.preventDefault();
    }
  }
  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  closeModalAndResetForm() {
    this.initTransactionForm();
  }
  onsub() {
    if (this.TransactionForm.invalid) {
      this.TransactionForm.markAllAsTouched();
      return;
    }
    console.log(this.TransactionForm.value)

      if (this.TransactionForm.value.typeTransaction === 'Crédit') {
        this.compteConcern.solde = Number(this.compteConcern.solde) - Number(this.TransactionForm.value.montant);
      } else {
        this.compteConcern.solde = Number(this.compteConcern.solde) + Number(this.TransactionForm.value.montant);
      }      

    this.CPS.updateCompte(this.idcourant,this.compteConcern).subscribe(()=>{
      this.TS.saveTransaction(this.TransactionForm.value).subscribe(() => {
        this.getAllTransactionByCompte(this.idcourant);
        Swal.fire({
          title: '',
          text: 'Ajout Avec succes',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
            this.getAllTransactionByCompte(this.idcourant);
          }
        });
      });
    })
    
  }

}
