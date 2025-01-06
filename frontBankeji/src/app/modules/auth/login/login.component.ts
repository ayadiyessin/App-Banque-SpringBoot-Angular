import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameErrors: string[] = [];
  usernameFormError: any = {};
  isUsernameFocused: boolean = false;

  passwordErrors: string[] = [];
  passwordFormError: any = {};
  isPasswordFocused: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  validUsername(): boolean {
    this.usernameErrors = [];
    this.usernameFormError = {};

    if (this.loginForm.get('username')?.invalid) {
      this.usernameErrors.push('username');
      this.usernameFormError.errorForUsername = 'Veuillez saisir un nom d\'utilisateur';
      return false;
    }
    return true;
  }

  validPassword(): boolean {
    this.passwordErrors = [];
    this.passwordFormError = {};

    if (this.loginForm.get('password')?.invalid) {
      this.passwordErrors.push('password');
      this.passwordFormError.errorForPassword = 'Le mot de passe doit contenir au moins 8 caractères';
      return false;
    }
    return true;
  }

  onUsernameFocus() {
    this.isUsernameFocused = true;
    this.clearUsernameError();
  }

  onUsernameBlur() {
    this.isUsernameFocused = false;
    this.checkUsernameError();
  }

  onPasswordFocus() {
    this.isPasswordFocused = true;
    this.clearPasswordError();
  }

  onPasswordBlur() {
    this.isPasswordFocused = false;
    this.checkPasswordError();
  }

  clearUsernameError() {
    this.usernameErrors = [];
    this.usernameFormError.errorForUsername = '';
  }

  clearPasswordError() {
    this.passwordErrors = [];
    this.passwordFormError.errorForPassword = '';
  }

  checkUsernameError() {
    if (!this.validUsername() && !this.isUsernameFocused) {
      this.usernameErrors.push('username');
      this.usernameFormError.errorForUsername = 'Veuillez saisir un nom d\'utilisateur';
    }
  }

  checkPasswordError() {
    if (!this.validPassword() && !this.isPasswordFocused) {
      this.passwordErrors.push('password');
      this.passwordFormError.errorForPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    }
  }

  onSingIn() {
    if (this.loginForm.invalid) {
      this.checkUsernameError();
      this.checkPasswordError();
      return;
    }

    const loginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur',
          text: 'Nom d\'utilisateur ou mot de passe incorrect',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  moveToForgetPassword() {
    this.router.navigate(['reset-password']);
  }
}
