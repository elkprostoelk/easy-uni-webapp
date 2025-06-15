import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {UserProfileDto} from '../dto/userProfileDto';
import {Observable} from 'rxjs';
import {ServiceResultDto} from '../dto/serviceResultDto';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  readonly endpointUrl = `${environment.apiUrl}api/userprofiles`;

  constructor(private readonly http: HttpClient) { }

  getUserProfile(userId: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.endpointUrl}/${userId}`);
  }

  editUserProfile(userId: string, profileForm: any): Observable<ServiceResultDto> {
    return this.http.put<ServiceResultDto>(`${this.endpointUrl}/${userId}`, profileForm);
  }
}
