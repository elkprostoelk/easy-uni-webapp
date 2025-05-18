import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginDto} from '../dto/loginDto';
import {environment} from '../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {ServiceTypedResultDto} from '../dto/serviceResultDto';
import {TokenDto} from '../dto/tokenDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.hasValidToken());
  private parsedToken = new BehaviorSubject<TokenDto | null>(this.parseToken());
  isLoggedIn$ = this.authState.asObservable();
  loggedInUserData$ = this.parsedToken.asObservable();

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
    this.parsedToken.next(this.parseToken());
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.authState.next(false);
    this.parsedToken.next(null);
  }

  private parseToken(): TokenDto | null {
    const token = localStorage.getItem('access_token');
    if (!token) {
       return null;
    }

    const parsed = JSON.parse(atob(token.split('.')[1]));
    return {
      expirationDate: new Date(parseInt(parsed['exp']) * 1000),
      userId: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      roles: parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    };
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    const expirationDate = this.parseToken()?.expirationDate;
    const now = new Date();

    return expirationDate !== undefined && now < expirationDate;
  }
}
