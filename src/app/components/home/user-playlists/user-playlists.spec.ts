import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPlaylists } from './user-playlists';
import { PlaylistService } from '../../../core/services/Playlist/playlist-service';
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../../models/playlist';

describe('UserPlaylists', () => {
  let component: UserPlaylists;
  let fixture: ComponentFixture<UserPlaylists>;
  
  // Creamos espías (mocks) para los servicios
  let playlistServiceSpy: jasmine.SpyObj<PlaylistService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  // Definimos los mocks con el tipo correcto para evitar errores de asignación
  const mockPlaylists: Playlist[] = [
    { id: 1, name: 'Rock 80s', description: 'Classic hits', songs: [], createdAt: new Date(), userId: 1 },
    { id: 2, name: 'Lo-fi Study', description: 'Focus music', songs: [], createdAt: new Date(), userId: 1 }
  ];

  beforeEach(async () => {
    playlistServiceSpy = jasmine.createSpyObj('PlaylistService', ['getAllUserPlaylists']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    // Corregimos el valor de retorno para que incluya 'message' y cumpla con Reply<Playlist[]>
    playlistServiceSpy.getAllUserPlaylists.and.returnValue(of({ 
      ok: true, 
      data: mockPlaylists,
      message: 'Success' 
    }));

    await TestBed.configureTestingModule({
      imports: [UserPlaylists, CommonModule],
      providers: [
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPlaylists);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit
    expect(component).toBeTruthy();
  });

  it('debe cargar las playlists al iniciar (ngOnInit)', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit -> loadAllPlaylists()

    expect(component.loading).toBeFalse();
    expect(component.playlists.length).toBe(2);
    expect(component.playlists).toEqual(mockPlaylists);
    expect(playlistServiceSpy.getAllUserPlaylists).toHaveBeenCalled();
  });

  it('debe manejar errores al cargar playlists', () => {
    // Forzamos un error en el servicio
    playlistServiceSpy.getAllUserPlaylists.and.returnValue(throwError(() => new Error('API Error')));

    component.loadAllPlaylists();

    expect(component.loading).toBeFalse();
    expect(notificationSpy.showError).toHaveBeenCalledWith('Error loading community playlists');
  });

  it('debe seleccionar una playlist para ver detalles', () => {
    const targetPlaylist = mockPlaylists[0];
    component.viewPlaylistDetails(targetPlaylist);

    expect(component.selectedPlaylist).toBe(targetPlaylist);
  });

  it('debe limpiar la selección al cerrar detalles', () => {
    component.selectedPlaylist = mockPlaylists[0];
    component.closeDetails();

    expect(component.selectedPlaylist).toBeNull();
  });
});