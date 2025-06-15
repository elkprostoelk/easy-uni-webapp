import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {mergeMap, take, tap} from 'rxjs';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {UserProfileService} from '../../services/user-profile.service';
import {UserProfileDto} from '../../dto/userProfileDto';
import {MessageService} from 'primeng/api';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {EditProfileInfoComponent} from './edit-profile-info/edit-profile-info.component';
import {GenderPipe} from '../../pipes/gender/gender.pipe';

@Component({
  selector: 'app-profile',
  imports: [
    Card,
    NgOptimizedImage,
    NgIf,
    DatePipe,
    ProgressSpinner,
    Button,
    Tooltip,
    EditProfileInfoComponent,
    GenderPipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileDto = new UserProfileDto();
  isProfileLoading = false;
  userId: string = '';
  editFormVisible = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
    private readonly messageService: MessageService) {}

  ngOnInit(): void {
    this.refreshUserProfile();
  }

  showEditProfileDialog() {
    this.editFormVisible = true;
  }

  onEditProfileCancelled() {}

  onProfileEdited() {
    this.refreshUserProfile();
  }

  private refreshUserProfile() {
    this.authService.loggedInUserData$.pipe(
      take(1),
      tap(() => this.isProfileLoading = true),
      mergeMap(userData => {
        this.userId = userData!.userId;
        return this.userProfileService.getUserProfile(this.userId);
      }))
      .subscribe({
        next: (userProfile) => this.userProfile = {...userProfile, birthDate: new Date(userProfile.birthDate).toISOString()},
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            data: 'Failed to get the user profile!',
            life: 3000
          });
          this.isProfileLoading = false;
        },
        complete: () => this.isProfileLoading = false
      });
  }
}
