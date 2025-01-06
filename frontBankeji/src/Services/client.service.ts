import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/Models/Client';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private httpClient :HttpClient ) {}

  findAllClient(): Observable < Client[] >
  {
     return this.httpClient.get<Client[]>('http://127.0.0.1:8081/clients/all');
  }

  saveClient(clientToSave:any): Observable<void>
  {

    return this.httpClient.post<void>('http://127.0.0.1:8081/clients/save',clientToSave);

  }

  getByIdClient(id:string):Observable<Client>
  {
    return this.httpClient.get<Client>(`http://127.0.0.1:8081/clients/getById/${id}`);
  }

  updateClient(id: string , client : Client ) : Observable < any >
  {
    return this.httpClient.put(`http://127.0.0.1:8081/clients/update/${id}`,client);
  }

  deleteClient(id: string): Observable<void> {
    const body = { id }; // Crée un objet avec le champ id
    return this.httpClient.post<void>('http://127.0.0.1:8081/clients/delete-ajax', body);
  }
  
}
