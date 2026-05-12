import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home, // Al ser standalone se importa aquí
        ReactiveFormsModule,
        RouterModule.forRoot([]), // Mock de rutas para el test
        HttpClientTestingModule   // Para que no falle por el AuthService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});