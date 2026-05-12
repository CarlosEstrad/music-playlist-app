import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/Login/auth';
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Spies para dependencias
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit para inicializar formularios
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE LOGIN ---

  it('debe invalidar el formulario de login si está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debe validar correctamente el email en el login', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('test');
    expect(email.hasError('email')).toBeTrue();
    
    email.setValue('test@example.com');
    expect(email.valid).toBeTrue();
  });

  it('debe navegar al home en login exitoso', () => {
    const loginData = { email: 'test@example.com', password: '123' };
    component.loginForm.setValue(loginData);
    
    // Corregimos el mock para que incluya token y user según la interfaz LoginData
    authServiceSpy.login.and.returnValue(of({ 
      ok: true, 
      message: 'Welcome', 
      data: { 
        token: 'fake-jwt-token', 
        user: { id: 1, username: 'testuser', email: 'test@example.com' } 
      } 
    }));

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith(loginData);
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Welcome');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debe mostrar error en login fallido', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: '123' });
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    component.onLogin();

    expect(notificationSpy.showError).toHaveBeenCalled();
  });

  // --- PRUEBAS DE REGISTRO ---

  it('debe abrir y cerrar el modal de registro', () => {
    component.openRegisterModal();
    expect(component.isRegisterModalOpen).toBeTrue();
    
    component.closeRegisterModal();
    expect(component.isRegisterModalOpen).toBeFalse();
  });

  it('debe validar que las contraseñas coincidan en el registro', () => {
    component.registerForm.patchValue({
      username: 'carlos',
      email: 'carlos@test.com',
      password: '123',
      confirmPassword: '456' // Diferente
    });

    expect(component.registerForm.hasError('mismatch')).toBeTrue();

    component.registerForm.patchValue({ confirmPassword: '123' }); // Igual
    expect(component.registerForm.hasError('mismatch')).toBeFalse();
  });

  it('debe registrar un usuario exitosamente', () => {
    const registerData = {
      username: 'userTest',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123'
    };
    component.registerForm.setValue(registerData);
    
    authServiceSpy.register.and.returnValue(of({ ok: true, message: 'Created', data: null as any }));

    component.onRegister();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Account created! Please login.');
    expect(component.isRegisterModalOpen).toBeFalse();
  });
});