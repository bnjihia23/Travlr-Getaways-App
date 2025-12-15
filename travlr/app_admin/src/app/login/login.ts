import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth_response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  formError = '';
  credentials = { name: '', email: '', password: '' };

  constructor(
    private router: Router,
    private authentication: Authentication
  ) {}

  onLoginSubmit(): void {
    this.formError = '';
    const { name, email, password } = this.credentials;

    if (!name || !email || !password) {
      this.formError = 'All fields required';
      return;
    }

    const user: User = { name, email };

    this.authentication.login(user, password).subscribe({
      next: (resp: AuthResponse) => {
        this.authentication.saveToken(resp.token);
        this.router.navigate(['/']); // or '/admin' if that’s your route
      },
      error: (err: any) => {
        console.error('Login error', err);
        this.formError = 'Invalid email or password';
      }
    });
  }
}