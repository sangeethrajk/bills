import { HttpClient } from '@angular/common/http';
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

  private _currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public get currentUserVal(): any {
    return this._currentUserSubject.value;
  }

  get isUserLoggedIn() {
    return this.currentUserVal;
  }
  constructor(private httpClient: HttpClient) {
    this._currentUserSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
    this.currentUser = this._currentUserSubject.asObservable();
  }

  authenticate(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/v1/auth/officer/login`, data);
  }



  logOut() {
    sessionStorage.clear()
    localStorage.removeItem('CurrentUser');
    this._currentUserSubject.next(null);
  }

  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(localStorage.getItem('CurrentUser')!);
    } catch (error) {
      return null!;
    }
  }

  authenticatelogout(username: any) {

    return this.httpClient.post<any>(`${this.baseURL}/api/logout`, { username }).pipe(
      map(userData => {


        return userData;
      })
    );
  }


}
