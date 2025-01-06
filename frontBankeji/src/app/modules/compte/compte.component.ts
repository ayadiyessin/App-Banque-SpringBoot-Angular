import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/Models/Client';
import { Compte } from 'src/Models/Compte';
import { ClientService } from 'src/Services/client.service';
import { CompteService } from 'src/Services/compte.service';
import Swal from 'sweetalert2';
declare var $: any; // Déclarez jQuery pour TypeScript

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private CS: ClientService, private CPS: CompteService) { }
  datasource = new MatTableDataSource<Compte>()
  displayedColumns: string[] = ['id', 'numeroCompte', 'typeCompte', 'solde', 'transaction', 'action'];
  nbCompte!: number
  CompteForm!: FormGroup
  idcourant!: string
  clientConnect!: Client
  OnLoud: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModal') closeModal: ElementRef


  ngOnInit(): void {
    this.idcourant = this.activatedRoute.snapshot.params['id'];
    this.getAllCompteByClient(this.idcourant);
    this.initCompteForm();
  }

  getAllCompteByClient(id: string) {
    this.CPS.getAllCompteByClient(id).subscribe(data => {
      this.datasource.data = data;
      this.nbCompte = data.length;
    });
    this.CS.getByIdClient(id).subscribe(dataCli => {
      this.clientConnect = dataCli;
      this.OnLoud = true;
    });
  }

  initCompteForm(): void {
    this.CompteForm = new FormGroup({
      numeroCompte: new FormControl(null, [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)]),
      typeCompte: new FormControl(null, [Validators.required]),
      solde: new FormControl(0, [Validators.required, Validators.pattern(/^\d*[1-9]\d*$/)]),
      clientId: new FormControl(this.idcourant, [Validators.required])
    })
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
    this.CompteForm.reset();
    this.closeModal.nativeElement.click();
  }
  onsub() {
    if (this.CompteForm.invalid) {
      this.CompteForm.markAllAsTouched();
      return;
    }
    console.log(this.CompteForm.value)
    this.CPS.getCompteByNumeroCompte(this.CompteForm.value.numeroCompte).subscribe(data=>{
      if(data.length!=0){
        Swal.fire({
          title: '',
          text: 'Le numéro de compte existe déja',
          icon: 'warning'
        })
      }
      else{
        this.CPS.saveCompte(this.CompteForm.value).subscribe(() => {
          this.getAllCompteByClient(this.idcourant);
          Swal.fire({
            title: '',
            text: 'Ajout Avec succes',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
              this.getAllCompteByClient(this.idcourant);
            }
          });
        });
      }
    })
    
  }


    deleteCompteAjax(id: string): void {
      const token = localStorage.getItem('access_token'); // Récupération du JWT
      if (!token) {
        console.error("JWT manquant, impossible de supprimer.");
        Swal.fire('Erreur', 'Utilisateur non authentifié.', 'error');
        return;
      }
  
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Une fois supprimé, ce compte ne pourra pas être récupéré !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `http://127.0.0.1:8081/comptes/delete-ajax?id=${id}`, // Ajoutez l'ID dans l'URL
            type: 'POST',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            },
            success: (response: any) => {
              Swal.fire({
                title: '',
                text: 'Suppression réussie',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            },
            error: (error: any) => {
              console.error('Erreur lors de la suppression', error);
            },
          });
          
        }
      });
    }
}

/*
$.ajax({
  url: 'http://127.0.0.1:8081/clients/delete-ajax',
  type: 'POST',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
  data: { id: id },
  success: (response) => {
    console.log('Suppression réussie', response);
  },
  error: (error) => {
    console.error('Erreur lors de la suppression', error);
  },
});   

  deleteCompte(id: string): void {
      const token = localStorage.getItem('access_token'); // Récupération du JWT
      if (!token) {
        console.error("JWT manquant, impossible de supprimer.");
        Swal.fire('Erreur', 'Utilisateur non authentifié.', 'error');
        return;
      }
  
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Une fois supprimé, ce compte ne pourra pas être récupéré !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Suppression en cours...'); // Debug message
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `http://localhost:8081/comptes/delete-ajax?id=${id}`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              Swal.fire({
                title: '',
                text: 'Suppression réussie',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
              console.error('Erreur lors de la suppression');
              Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
            }
          };
          xhr.send(); // Envoi de la requête
        }
      });
    }
  */