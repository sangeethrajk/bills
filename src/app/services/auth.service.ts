import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export class User {
  constructor(public status: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  authenticate(username: any, password_encrypted: any, role: any) {
    return this.httpClient.post<any>('http://localhost:8080/api/login', { username, password_encrypted, role }).pipe(
      map(userData => {
        sessionStorage.setItem('username', username);
        let tokenStr = 'Bearer ' + userData.token;
        sessionStorage.setItem('id', userData.id);
        sessionStorage.setItem('value', userData.group_name);
        sessionStorage.setItem('type', userData.accesslevel1);
        sessionStorage.setItem('role', userData.role);
        sessionStorage.setItem('isloggedin', userData.loggedin);
        sessionStorage.setItem('token', tokenStr);
        localStorage.setItem('CurrentUser', JSON.stringify(userData));
        this._currentUserSubject.next(userData);
        return userData;
      })
    );
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

    return this.httpClient.post<any>('http://localhost:8080/api/logout', { username }).pipe(
      map(userData => {


        return userData;
      })
    );
  }


}
