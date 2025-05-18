import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-welcome-page',
  imports: [
    ButtonDirective,
    RouterLink,
    NgIf
  ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.less'
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  loggedInStateSubscription: Subscription = new Subscription();

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInStateSubscription = this.authService.isLoggedIn$
      .subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  ngOnDestroy(): void {
    this.loggedInStateSubscription.unsubscribe();
  }
}
