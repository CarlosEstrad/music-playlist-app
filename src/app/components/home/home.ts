import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/Login/auth';
import { NotificationService } from '../../core/services/notifications/notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  updateForm!: FormGroup; 
  isExpanded = true;
  isUpdateModalOpen = false;

  // Datos de ejemplo del usuario
  user = { name: 'John Doe', role: 'Full Stack Engineer', email: '' };

  constructor(private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.user.name = localStorage.getItem('username') || 'Invitado';
    this.user.email = localStorage.getItem('email') || 'Invitado@Invitado.com';

    if (window.innerWidth < 768) {
      this.isExpanded = false;
    }

    this.updateForm = this.fb.group({
      username: [this.user.name, [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.minLength(3)]]
    });
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  openUpdateModal() {
    // Resetear el formulario con el nombre actual del usuario
    this.updateForm.patchValue({ username: this.user.name, password: '' });
    this.isUpdateModalOpen = true;
  }

  onUpdateProfile() {
    if (this.updateForm.invalid) return;

    this.authService.updateProfile(this.updateForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess('Profile updated successfully');
          // Actualizamos el nombre en la UI localmente
          this.user.name = this.updateForm.value.username;
          this.isUpdateModalOpen = false;
        }
      },
      error: (err) => this.notification.showError(err.error?.message || 'Error updating profile')
    });
  }
}
