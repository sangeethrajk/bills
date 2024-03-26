import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CanaraBankService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private httpClient: HttpClient) { }

  balanceEnquiry(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const data = {
      "Authorization": "Basic U1lFREFQSUFVVEg6MmE4OGE5MWE5MmE2NGEx",
      "acctNumber": "2774201000198",
      "customerID": "13961989"
    };
    return this.httpClient.post(`${this.baseUrl}/api/v1/canara/balanceEnquiry`, data, { headers: headers });
  }

  decryptData(encryptData: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post(`${this.baseUrl}/api/v1/canara/decrypt`, encryptData, { headers: headers });
  }

  fundTransfer(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post(`${this.baseUrl}/api/v1/canara/fundTransfer`, data, { headers: headers });
  }

  checkStatus(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post(`${this.baseUrl}/api/v1/canara/checkStatus`, data, { headers: headers });
  }

}
