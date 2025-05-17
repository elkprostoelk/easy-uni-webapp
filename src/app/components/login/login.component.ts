import {Component, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {LoginDto} from '../../dto/loginDto';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ToastModule,
    Button
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: UntypedFormBuilder,
    private readonly messageService: MessageService) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']).then();
      }
    })
  }

  login(): void {
    this.isLoading = true;
    this.authService.login(this.loginForm.value as LoginDto)
      .subscribe({
        next: (result) => {
          this.authService.setAuthToken(result.result);
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            data: 'Successfully logged in!',
            life: 3000
          });
          this.router.navigate(['/']).then();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            data: 'Failed to log in!',
            life: 3000
          });
        },
        complete: () => this.isLoading = false
      });
  }
}
