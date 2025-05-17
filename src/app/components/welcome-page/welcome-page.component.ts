import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';

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
export class WelcomePageComponent implements OnInit {
  isLoggedIn = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }
}
