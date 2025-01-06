import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/Models/Client';
import { ClientService } from 'src/Services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private CS: ClientService) { }
  idcourant!: string;
  inforClient!: Client
  ClientForm!: FormGroup
  OnLoud: boolean = false;

  ngOnInit(): void {
    this.idcourant = this.activatedRoute.snapshot.params['id'];
    this.getClientById(this.idcourant);
  }

  getClientById(id: string) {
    this.CS.getByIdClient(id).subscribe(data => {
      this.inforClient = data;
      this.initClientForm(this.inforClient);
      this.OnLoud = true;
    });
  }
  initClientForm(client: Client): void {
    this.ClientForm = new FormGroup({
      nom: new FormControl(client.nom, [Validators.required]),
      prenom: new FormControl(client.prenom, [Validators.required]),
      email: new FormControl(client.email, [Validators.required]),
      telephone: new FormControl(client.telephone, [Validators.required]),
      adresse: new FormControl(client.adresse, [Validators.required])
    })
  }

  reloadPage(): void {
    window.location.reload();
  }

  onupdate() {
    console.log(this.ClientForm.value)
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
        this.CS.updateClient(this.idcourant, this.ClientForm.value).subscribe(() => {
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
