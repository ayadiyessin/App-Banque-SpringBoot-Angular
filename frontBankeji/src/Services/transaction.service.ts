import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from 'src/Models/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpClient: HttpClient) { }

  findAllTransaction(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>('http://127.0.0.1:8081/transactions/all');
  }

  saveTransaction(transactionToSave: any): Observable<void> {

    return this.httpClient.post<void>('http://127.0.0.1:8081/transactions/save', transactionToSave);
  }

  getByIdTransaction(id: string): Observable<Transaction> {
    return this.httpClient.get<Transaction>(`http://127.0.0.1:8081/transactions/getById/${id}`);
  }

  getAllTransactionByCompte(id: string): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>(`http://127.0.0.1:8081/transactions/ByCompte/${id}`);
  }
}
