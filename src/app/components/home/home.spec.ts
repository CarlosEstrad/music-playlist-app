import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/Login/auth';
import { NotificationService } from '../../core/services/notifications/notification-service';
import { Router } from '@angular/router';

describe('Home Component - Unit Tests', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    // Creamos mocks de los servicios
    const authSpy = jasmine.createSpyObj('AuthService', ['updateProfile']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        Home,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Simulamos datos en localStorage antes de iniciar
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'username') return 'UsuarioPrueba';
      return null;
    });

    fixture.detectChanges(); // Ejecuta ngOnInit
  });

  // PRUEBA 1: Verificación de inicialización
  it('debe inicializar el formulario con el nombre de usuario del localStorage', () => {
    expect(component.updateForm).toBeDefined();
    expect(component.updateForm.get('username')?.value).toBe('UsuarioPrueba');
  });

  // PRUEBA 2: Flujo de actualización exitoso
  it('debe llamar al servicio de actualización y cerrar el modal al tener éxito', () => {
    // Configuramos el mock para devolver una respuesta exitosa
    const mockReply = {
      ok: true,
      message: 'Success',
      data: null
    } as any;

    authService.updateProfile.and.returnValue(of(mockReply));

    // Simulamos apertura de modal y llenado de datos
    component.isUpdateModalOpen = true;
    component.updateForm.patchValue({
      username: 'NuevoNombre',
      password: 'newpassword123'
    });

    component.onUpdateProfile();

    // Verificaciones
    expect(authService.updateProfile).toHaveBeenCalledWith({
      username: 'NuevoNombre',
      password: 'newpassword123'
    });
    expect(notificationService.showSuccess).toHaveBeenCalled();
    expect(component.user.name).toBe('NuevoNombre');
    expect(component.isUpdateModalOpen).toBeFalse();
  });

  it('debe alternar el estado de isExpanded al llamar a toggleSidenav', () => {
    const initialValue = component.isExpanded;
    component.toggleSidenav();
    expect(component.isExpanded).toBe(!initialValue);

    component.toggleSidenav();
    expect(component.isExpanded).toBe(initialValue);
  });

  it('debe limpiar el localStorage y navegar al login al cerrar sesión', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const clearSpy = spyOn(localStorage, 'removeItem');

    component.onLogout();

    // Verificamos que se intenten borrar las llaves específicas
    expect(clearSpy).toHaveBeenCalledWith('token');
    expect(clearSpy).toHaveBeenCalledWith('username');
    expect(clearSpy).toHaveBeenCalledWith('email');

    // Verificamos la redirección
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debe resetear el formulario y abrir el modal al llamar a openUpdateModal', () => {
    // Agregamos el role para cumplir con la interfaz
    component.user = {
      name: 'Lucas',
      email: 'lucas@test.com',
      role: 'Admin' // O el valor que corresponda
    };

    component.openUpdateModal();

    expect(component.isUpdateModalOpen).toBeTrue();
    expect(component.updateForm.get('username')?.value).toBe('Lucas');
  });
});