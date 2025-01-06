import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from 'src/Models/AuthResponse';
import { LoginRequest } from 'src/Models/LoginRequest';
import { RegisterRequest } from 'src/Models/RegisterRequest';
import { Utilisateur } from 'src/Models/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';

  // Using signals for reactive state management
  private readonly currentUser = signal<Utilisateur | null>(null);
  private readonly authToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.authToken());
  readonly user = computed(() => this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.authToken.set(storedToken);
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.authToken.set(response.token);
        this.currentUser.set({
          id:response.username,
          username: response.username,
          password:response.token
        });
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('user', JSON.stringify(this.currentUser()));
      })
    );
  }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerData);
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(`${this.API_URL}/logout`, {}, { headers }).subscribe({
        next: () => {
          this.authToken.set(null);
          this.currentUser.set(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed:', err);
          this.router.navigate(['/login']);
        },
      });
    } else {
      console.log('No token found for logout');
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return this.authToken();
  }
}
