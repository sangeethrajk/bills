import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };


  constructor(private httpClient: HttpClient) { }

  //New APIs

  //Works API in EE Logins
  getOfficersBydivision(division: any): Observable<any> {
    const encodedDivision = encodeURIComponent(division);
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getOfficersByDivision?division=${encodedDivision}`, { id: 1 }, this.headers);
  }

  addWork(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/add-work`, data, this.headers);
  }

  getAllWorks(division: any): Observable<any> {
    const encodedDivision = encodeURIComponent(division);
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getAllWorksByDivision?division=${encodedDivision}`, { id: 1 }, this.headers);
  }

  getWorkById(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getWork/${id}`, { id: 1 }, this.headers);
  }

  deleteWorkById(id: any): Observable<any> {
    const headers = new HttpHeaders(); // Create an instance of HttpHeaders
    headers.set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/api/v1/bill/deleteWork/${id}`, { headers: headers, responseType: 'text' });
  }

  //get all pending vendor projects
  getPendingProjectsByDivision(division: string): Observable<any> {
    const encodedDivision = encodeURIComponent(division);
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getPendingProjectsByDivision/${encodedDivision}`, { id: 1 }, this.headers);
  }

  //get pending project by id
  getPendingProjectById(id: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getPendingProjectById/${id}`, { id: 1 }, this.headers);
  }

  //verify project by id
  verifyProjectById(id: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/verify/${id}`, { id: 1 }, this.headers);
  }



  //TNHB Bank Accounts API
  saveBankAccount(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bankAccount/save`, data, this.headers);
  }

  editBankAccount(data: any, id: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/api/v1/bankAccount/edit/${id}`, data, this.headers);
  }

  deleteBankAccount(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/api/v1/bankAccount/delete/${id}`, this.headers);
  }

  getAllBankAccounts(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/bankAccount/all`, this.headers);
  }

  //get all bills based on division and role
  getAllBillsBasedOnDivision(division: string, role: string): Observable<any> {
    const encodedDivision = encodeURIComponent(division);
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getBillsByDivision/${encodedDivision}/${role}`, { id: 1 }, this.headers);
  }

  //get single bill based on id
  getSingleBillBasedOnId(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getBillById/${id}`, { id: 1 }, this.headers);
  }

  //Get the amount released upto previous bill
  getAmountReleasedUptoPreviousBill(vendorProjectId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/bill/total/${vendorProjectId}`, this.headers);
  }

  //update bill by role
  updateBillByRole(role: string, id: any, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/api/v1/bill/updateBill/${role}/${id}`, data, this.headers);
  }

  //get all bills using username
  getAllBillsForUsername(username: string, role: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/getAllBillsForUsername/${username}/${role}`, { id: 1 }, this.headers);
  }

  //get all bills processed by MD
  getAllBillsProcessedByMD(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/bill/billsProcessedByMD`, this.headers);
  }

  //save utr and user ref number
  saveUtrUserRefInBill(id: number, utrNumber: string, userRefNumber: string): Observable<any> {
    const url = `${this.baseUrl}/api/v1/bill/${id}/save-utr-user-ref`;
    const data = {
      utrNumber: utrNumber,
      userRefNumber: userRefNumber,
      billStatus: "Processed"
    }
    return this.httpClient.post<any>(url, data, this.headers);
  }

  getAllProcessedBills(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/bill/processedBills`, this.headers);
  }

  saveLCPdf(data: FormData): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/bill/saveLCPdf`, data, this.headers);
  }

}
