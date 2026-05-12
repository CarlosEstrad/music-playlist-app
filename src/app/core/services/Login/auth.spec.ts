import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { environment } from '../../../../environments/environment';
import { LoginData, Reply } from '../../../models/helpers';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/Auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    spyOn(localStorage, 'setItem').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe realizar login y guardar datos en localStorage', () => {
    const mockCredentials = { email: 'test@test.com', password: '123' };
    const mockResponse: Reply<LoginData> = {
      ok: true,
      message: 'Success',
      data: {
        token: 'fake-token',
        user: { id: 1, username: 'testuser', email: 'test@test.com' }
      }
    };

    service.login(mockCredentials).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.data?.token).toBe('fake-token');
      // Verificamos que se guardó en localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debe obtener el token de localStorage', () => {
    localStorage.setItem('token', 'stored-token');
    expect(service.getToken()).toBe('stored-token');
  });

  it('debe realizar el registro de usuario', () => {
    const mockRegisterData = {
      username: 'newuser',
      email: 'new@test.com',
      password: '123'
    };
    const mockResponse: Reply<LoginData> = {
      ok: true,
      message: 'User registered',
      data: null as any
    };

    service.register(mockRegisterData as any).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('User registered');
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debe actualizar el perfil del usuario', () => {
    const updateData = { username: 'updatedName' };
    const mockResponse: Reply<LoginData> = {
      ok: true,
      message: 'Profile updated',
      data: null as any
    };

    service.updateProfile(updateData).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('Profile updated');
    });

    const req = httpMock.expectOne(`${apiUrl}/update-profile`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});