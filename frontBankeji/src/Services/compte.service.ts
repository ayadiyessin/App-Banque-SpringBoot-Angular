import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from 'src/Models/Compte';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor(private httpClient :HttpClient ) {}

    findAllCompte(): Observable < Compte[] >
    {
       return this.httpClient.get<Compte[]>('http://127.0.0.1:8081/comptes/all');
    }

    saveCompte(compteToSave:any): Observable<void>
    {

      return this.httpClient.post<void>('http://127.0.0.1:8081/comptes/save',compteToSave);
    }

    getByIdCompte(id:string):Observable<Compte>
    {
      return this.httpClient.get<Compte>(`http://127.0.0.1:8081/comptes/getById/${id}`);
    }

    updateCompte(id: string , compte : Compte ) : Observable < any >
    {
      return this.httpClient.put(`http://127.0.0.1:8081/comptes/update/${id}`,compte);
    }

    getAllCompteByClient(id: string): Observable < Compte[] >
    {
       return this.httpClient.get<Compte[]>(`http://127.0.0.1:8081/comptes/ByClient/${id}`);
    }
    getCompteByNumeroCompte(numeroCompte: string): Observable < Compte[] >
    {
       return this.httpClient.get<Compte[]>(`http://127.0.0.1:8081/comptes/ByNumeroCompte/${numeroCompte}`);
    }
}
