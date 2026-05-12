import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa las herramientas reactivas
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/Login/auth';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notifications/notification-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isRegisterModalOpen = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  openRegisterModal(): void {
    this.registerForm.reset();
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen = false;
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess('Account created! Please login.');
          this.closeRegisterModal(); // Volvemos automáticamente al login
        }
        this.loading = false;
      },
      error: (err) => {
        this.notification.showError(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.ok) {
          this.notification.showSuccess(response.message || 'Operation successful!');
          this.router.navigate(['/home']);
        } else {
          this.notification.showError(response.message || 'Check the data provided.');
        }
      },
      error: (err) => {
        console.error('Error en el servidor', err);
        this.notification.showError('Server connection lost. Please try later.');
      }
    });
  }
}