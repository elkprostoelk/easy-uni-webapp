import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(
    private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  logout(): void {
    this.authService.logout();
  }
}
