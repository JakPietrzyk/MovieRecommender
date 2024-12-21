import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, tap} from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api.response';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = 'http://localhost:8080/api/user';
  private loginUrl = "/login";
  private registerUrl = "/register";

  private userSource = new BehaviorSubject<User | null>(null);
  currentUser = this.userSource.asObservable();

  constructor(private http: HttpClient) { }

  authorizeUser(login: string, password: string): Observable<User | ApiResponse> {
    return this.http.post<User | ApiResponse>(this.apiUrl + this.loginUrl, { login, password }).pipe(
      tap((data) => {
        if ('id' in data) {
          this.userSource.next(data as User);
        }
      })
    );
  }

  createNewUser(login: string, password: string): Observable<string> {
    return this.http.post<string>(this.apiUrl + this.registerUrl, { login, password });
  }

  getCurrentUser(): User | null {
    return this.userSource.getValue();
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout(): void {
    this.userSource.next(null);
    localStorage.removeItem('currentUser');
  }
}
