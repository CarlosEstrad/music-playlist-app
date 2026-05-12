import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Configuramos el cliente HTTP para que use nuestro interceptor
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    
    // Limpiamos el localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    // Verificamos que no queden peticiones pendientes
    httpMock.verify();
  });

  it('debe añadir el header Authorization si el token existe en localStorage', () => {
    const mockToken = 'token-de-prueba-123';
    localStorage.setItem('token', mockToken);

    // Hacemos una petición cualquiera
    httpClient.get('/api/test').subscribe();

    // Capturamos la petición que intentó salir
    const req = httpMock.expectOne('/api/test');

    // Verificamos que tenga el header correcto
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    
    req.flush({}); // Cerramos la petición
  });

  it('no debe añadir el header Authorization si no hay token', () => {
    // No seteamos nada en localStorage
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    // Verificamos que NO tenga el header
    expect(req.request.headers.has('Authorization')).toBeFalse();
    
    req.flush({});
  });
});