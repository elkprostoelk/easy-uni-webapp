import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Avatar} from 'primeng/avatar';
import {AuthService} from './services/auth.service';
import {NgIf} from '@angular/common';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Avatar, NgIf, Toast, Button, Menu],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isLoggedIn = false;
  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.openProfile()
    },
    {
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']).then();
  }

  openProfile(): void {
    this.router.navigate(['/profile']).then();
  }
}
