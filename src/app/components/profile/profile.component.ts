import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {mergeMap} from 'rxjs';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {UserProfileService} from '../../services/user-profile.service';
import {UserProfileDto} from '../../dto/userProfileDto';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-profile',
  imports: [
    Card,
    NgOptimizedImage,
    NgIf,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileDto = new UserProfileDto();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
    private readonly messageService: MessageService) {}

  ngOnInit(): void {
    this.authService.loggedInUserData$.pipe(
      mergeMap(userData => this.userProfileService.getUserProfile(userData!.userId)))
      .subscribe({
        next: (userProfile) => {
          this.userProfile = userProfile;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            data: 'Failed to get the user profile!',
            life: 3000
          })
        }
      });
  }
}
