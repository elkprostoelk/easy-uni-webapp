import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {UserProfileDto} from '../dto/userProfileDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  readonly endpointUrl = `${environment.apiUrl}api/userprofiles`;

  constructor(private readonly http: HttpClient) { }

  getUserProfile(userId: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.endpointUrl}/${userId}`);
  }
}
