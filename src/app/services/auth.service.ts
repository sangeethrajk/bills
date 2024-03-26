import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

export class User {
  constructor(public status: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = environment.apiURL;

  constructor(private httpClient: HttpClient) {

  }

  authenticate(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/v1/auth/officer/login`, data);
  }

  resetPassword(username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(`${this.baseURL}/api/v1/auth/officer/reset`, { username }, { headers });
  }

  verifyOTP(username: string, otp: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = { username, otp, newPassword }; // Corrected object initialization
    return this.httpClient.post<any>(`${this.baseURL}/api/v1/auth/officer/verify`, data, { headers });
  }

}
