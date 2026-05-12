import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Songs } from './songs';
import { SongService } from '../../../core/services/Songs/song-service';
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Song } from '../../../models/songs';

describe('Songs', () => {
  let component: Songs;
  let fixture: ComponentFixture<Songs>;
  
  // Mocks de servicios
  let songServiceSpy: jasmine.SpyObj<SongService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockSongs: Song[] = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55' },
    { id: 2, title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: '3:50' }
  ];

  beforeEach(async () => {
    songServiceSpy = jasmine.createSpyObj('SongService', ['getAllSongs', 'createSong', 'updateSong', 'deleteSong']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

    // Respuestas por defecto
    songServiceSpy.getAllSongs.and.returnValue(of({ ok: true, data: mockSongs, message: 'Success' }));

    await TestBed.configureTestingModule({
      imports: [Songs, ReactiveFormsModule],
      providers: [
        { provide: SongService, useValue: songServiceSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Songs);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe cargar las canciones al inicializar', () => {
    fixture.detectChanges();
    expect(component.songs.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('debe resetear el formulario al abrir el modal de creación', () => {
    component.openCreateModal();
    expect(component.isEditing).toBeFalse();
    expect(component.isModalOpen).toBeTrue();
    expect(component.songForm.get('id')?.value).toBe(0);
  });

  it('debe rellenar el formulario al abrir el modal de edición', () => {
    const song = mockSongs[0];
    component.openEditModal(song);
    
    expect(component.isEditing).toBeTrue();
    expect(component.isModalOpen).toBeTrue();
    expect(component.songForm.get('title')?.value).toBe(song.title);
    // Verificamos la conversión de '5:55' a segundos (5*60 + 55 = 355)
    expect(component.songForm.get('duration')?.value).toBe(355);
  });

  it('no debe guardar si el formulario es inválido', () => {
    component.songForm.patchValue({ title: '' }); // Título vacío (requerido)
    component.saveSong();
    expect(songServiceSpy.createSong).not.toHaveBeenCalled();
  });

  it('debe llamar a createSong cuando no se está editando', () => {
    component.isEditing = false;
    component.songForm.patchValue({
      title: 'New Song',
      artist: 'Artist',
      album: 'Album',
      duration: 180
    });
    songServiceSpy.createSong.and.returnValue(of({ ok: true, message: 'Created', data: null }));
    
    component.saveSong();
    
    expect(songServiceSpy.createSong).toHaveBeenCalled();
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Created');
  });

  it('debe llamar a updateSong cuando se está editando', () => {
    component.isEditing = true;
    component.songForm.patchValue({
      id: 1,
      title: 'Updated Song',
      artist: 'Artist',
      album: 'Album',
      duration: 200
    });
    songServiceSpy.updateSong.and.returnValue(of({ ok: true, message: 'Updated', data: null }));
    
    component.saveSong();
    
    expect(songServiceSpy.updateSong).toHaveBeenCalled();
  });

  it('debe abrir modal de confirmación al intentar eliminar', () => {
    const song = mockSongs[0];
    component.deleteSong(song);
    expect(component.isDeleteModalOpen).toBeTrue();
    expect(component.songToDelete).toBe(song);
  });

  it('debe eliminar la canción y mostrar notificación de éxito', () => {
    component.songToDelete = mockSongs[0];
    songServiceSpy.deleteSong.and.returnValue(of({ ok: true, message: 'Deleted', data: null }));
    
    component.confirmDelete();
    
    expect(songServiceSpy.deleteSong).toHaveBeenCalledWith(mockSongs[0].id);
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Deleted');
    expect(component.isDeleteModalOpen).toBeFalse();
  });

  it('debe manejar error al eliminar canción', () => {
    component.songToDelete = mockSongs[0];
    songServiceSpy.deleteSong.and.returnValue(throwError(() => new Error('Error')));
    
    component.confirmDelete();
    
    expect(notificationSpy.showError).toHaveBeenCalledWith('Could not delete the song.');
  });
});