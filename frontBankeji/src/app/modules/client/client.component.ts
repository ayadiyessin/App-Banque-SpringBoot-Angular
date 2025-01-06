import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/Models/Client';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClientService } from 'src/Services/client.service';
import { map, Observable, startWith } from 'rxjs';
declare var $: any; // Déclarez jQuery pour TypeScript

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit{
  constructor(private CS: ClientService) { }
  datasource = new MatTableDataSource<Client>()
  displayedColumns: string[] = ['id', 'nomPrenom', 'email', 'telephone', 'adresse', 'compte', 'action'];
  ClientForm!: FormGroup
  OnLoud: boolean = false;
  nbClient!:number
  clients:Client[] = [];

  filteredNoms!: Observable<string[]>;
  filteredPrenoms!: Observable<string[]>;
  filteredAdresses!: Observable<string[]>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModal') closeModal: ElementRef


  ngOnInit(): void {
    this.findAllClient();
    this.initClientForm();
    this.setupAutoComplete();
  }

  findAllClient() {
    this.CS.findAllClient().subscribe(data => {
      this.datasource.data = data;
      this.nbClient = data.length;
      this.clients=data;
      this.OnLoud = true;
    });
  }

  private _filter(value: string, list: string[]): string[] {
    const filterValue = value.toLowerCase();
    // Supprimer les doublons et appliquer le filtre insensible à la casse
    return [...new Set(list.map(option => option.toLowerCase()))].filter(option =>
      option.includes(filterValue)
    );
  }

  setupAutoComplete() {
    // Setup nom autocomplete
    this.filteredNoms = this.ClientForm.get('nom')!.valueChanges.pipe(
      startWith(''),
      map(value =>this._filter(value || '', this.clients.map(client => client.nom))
      )
    );

    // Setup prenom autocomplete
    this.filteredPrenoms = this.ClientForm.get('prenom')!.valueChanges.pipe(
      startWith(''),
      map(value =>this._filter(value || '', this.clients.map(client => client.prenom))
      )
    );

    // Setup adresse autocomplete
    this.filteredAdresses = this.ClientForm.get('adresse')!.valueChanges.pipe(
      startWith(''),
      map(value =>this._filter(value || '', this.clients.map(client => client.adresse))
      )
    );
  }

  initClientForm(): void {
    this.ClientForm = new FormGroup({
      nom: new FormControl(null, [Validators.required]),
      prenom: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email // Validation du format email
      ]),
      telephone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[2-9][0-9]{7}$/)
      ]),
      adresse: new FormControl(null, [Validators.required])
    });
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
    this.ClientForm.reset();
    this.closeModal.nativeElement.click();

  }
  onsub() {
    if (this.ClientForm.invalid) {
      this.ClientForm.markAllAsTouched();
      return;
    }
    console.log(this.ClientForm.value)
    this.CS.saveClient(this.ClientForm.value).subscribe(() => {
      this.findAllClient();
      Swal.fire({
        title: '',
        text: 'Ajout Avec succes',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
          this.findAllClient();
        }
      });
    });
  }

  deleteClient(id: string): void {
    const token = localStorage.getItem('access_token'); // Récupération du JWT
    if (!token) {
      console.error("JWT manquant, impossible de supprimer.");
      Swal.fire('Erreur', 'Utilisateur non authentifié.', 'error');
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Une fois supprimé, ce client ne pourra pas être récupéré !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `http://127.0.0.1:8081/clients/delete-ajax?id=${id}`, // Ajoutez l'ID dans l'URL
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

