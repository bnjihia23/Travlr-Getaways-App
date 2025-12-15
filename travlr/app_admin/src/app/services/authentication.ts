import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth_response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Authentication {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  /** token helpers */
  public saveToken(token: string): void { this.storage.setItem('travlr-token', token); }
  public getToken(): string { return this.storage.getItem('travlr-token') || ''; }
  public logout(): void { this.storage.removeItem('travlr-token'); this.router.navigate(['/login']); }
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > (Date.now() / 1000);
  }
  public getCurrentUser(): User {
    const token = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  /** API calls (return Observables – no subscribe here) */
  public register(user: User, password: string): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('name', user.name);
    body.set('email', user.email);
    body.set('password', password);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/register`, body.toString(), { headers });
  }

  public login(user: User, password: string): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', password);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/login`, body.toString(), { headers });
  }
}