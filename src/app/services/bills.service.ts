import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  getPendingWith(role: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/getPendingwith`, { role });
  }

  getReviewedWith(role: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/reviewedBills`, { role });
  }
  getAll(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/getAll`, { id });
  }

  getapplbyid(nId: number): Observable<any> {
    const url = `${this.baseUrl}/getBynId`;
    const requestData = { nId: nId };

    return this.httpClient.post(url, requestData).pipe(
      catchError((error: any) => {
        console.error('Error occurred:', error);
        throw error;
      })
    );
  }

  saveNewBill(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(`${this.baseUrl}/saveNewBill`, data, httpOptions);
  }

  getTotalBills(id: number): Observable<any> {
    const requestBody = { id };
    return this.httpClient.post(`${this.baseUrl}/getTotalBill`, requestBody);
  }
}
