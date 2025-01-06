import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/Models/Client';
import { Compte } from 'src/Models/Compte';
import { ClientService } from 'src/Services/client.service';
import { CompteService } from 'src/Services/compte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-compte',
  templateUrl: './update-compte.component.html',
  styleUrls: ['./update-compte.component.css']
})
export class UpdateCompteComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private CS: ClientService, private CPS: CompteService) { }
  idcourant!: string;
  inforClient!: Client
  informCompte!: Compte
  CompteForm!: FormGroup
  OnLoud: boolean = false;

  ngOnInit(): void {
    this.idcourant = this.activatedRoute.snapshot.params['id'];
    this.getCompteById(this.idcourant);
  }

  getCompteById(id: string) {
    this.CPS.getByIdCompte(id).subscribe(data => {
      this.informCompte = data;
      this.getClientById(this.informCompte.clientId);
      this.initCompteForm(this.informCompte);
      this.OnLoud = true;
    });
  }

  getClientById(id: string) {
    this.CS.getByIdClient(id).subscribe(data => {
      this.inforClient = data;
    });
  }

  initCompteForm(compte: Compte): void {
    this.CompteForm = new FormGroup({
      numeroCompte: new FormControl(compte.numeroCompte, [Validators.required]),
      typeCompte: new FormControl(compte.typeCompte, [Validators.required]),
      solde: new FormControl(compte.solde, [Validators.required]),
      clientId: new FormControl(compte.clientId, [Validators.required])
    })
  }

  reloadPage(): void {
    window.location.reload();
  }

  onupdate() {
    console.log(this.CompteForm.value)
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Les modifications apportées seront sauvegardées et ne pourront pas être annulées !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.CPS.updateCompte(this.idcourant, this.CompteForm.value).subscribe(() => {
          Swal.fire({
            title: '',
            text: 'Modifier avec succes',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        });
      }
    });
  }
}
