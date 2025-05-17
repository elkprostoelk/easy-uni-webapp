import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginDto} from '../dto/loginDto';
import {environment} from '../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {ServiceTypedResultDto} from '../dto/serviceResultDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.authState.asObservable();

  constructor(private readonly http: HttpClient) { }

  login(loginDto: LoginDto): Observable<ServiceTypedResultDto<string>> {
    return this.http.post<ServiceTypedResultDto<string>>(`${environment.apiUrl}api/auth/login`, loginDto);
  }

  setAuthToken(token: string | null): void {
    if (!token) {
      return;
    }

    localStorage.setItem('access_token', token);
    this.authState.next(true);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.authState.next(false);
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    const expiresAt = parseInt(JSON.parse(atob(token.split('.')[1]))['exp']);
    const expirationDate = new Date(expiresAt * 1000);
    const now = new Date();

    return now < expirationDate;
  }
}
