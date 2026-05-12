import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistManager } from './playlist-manager';
import { PlaylistService } from '../../../core/services/Playlist/playlist-service';
import { SongService } from '../../../core/services/Songs/song-service';
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Playlist } from '../../../models/playlist';
import { Song } from '../../../models/songs';

describe('PlaylistManager', () => {
  let component: PlaylistManager;
  let fixture: ComponentFixture<PlaylistManager>;

  // Spies para los servicios
  let playlistServiceSpy: jasmine.SpyObj<PlaylistService>;
  let songServiceSpy: jasmine.SpyObj<SongService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockSongs: Song[] = [
    { id: 101, title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:00' },
    { id: 102, title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:00' }
  ];

  const mockPlaylists: Playlist[] = [
    { 
      id: 1, 
      name: 'My Favorites', 
      description: 'The best songs', 
      songs: [mockSongs[0]], 
      createdAt: new Date(),
      userId: 1 
    }
  ];

  beforeEach(async () => {
    playlistServiceSpy = jasmine.createSpyObj('PlaylistService', [
      'getUserPlaylists', 'createPlaylist', 'updatePlaylist', 'deletePlaylist', 
      'addSongToPlaylist', 'removeSongFromPlaylist'
    ]);
    songServiceSpy = jasmine.createSpyObj('SongService', ['getAllSongs']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

    // Respuestas por defecto exitosas
    playlistServiceSpy.getUserPlaylists.and.returnValue(of({ ok: true, data: mockPlaylists, message: 'Ok' }));
    songServiceSpy.getAllSongs.and.returnValue(of({ ok: true, data: mockSongs, message: 'Ok' }));

    await TestBed.configureTestingModule({
      imports: [PlaylistManager, ReactiveFormsModule],
      providers: [
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: SongService, useValue: songServiceSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistManager);
    component = fixture.componentInstance;
    // No llamamos a detectChanges aquí para controlar cuándo se dispara el ngOnInit
  });

  it('should create and load data on init', () => {
    fixture.detectChanges(); // Dispara ngOnInit
    expect(component).toBeTruthy();
    expect(playlistServiceSpy.getUserPlaylists).toHaveBeenCalled();
    expect(songServiceSpy.getAllSongs).toHaveBeenCalled();
    expect(component.playlists.length).toBe(1);
    expect(component.allAvailableSongs.length).toBe(2);
  });

  it('debe seleccionar una playlist y cargar sus canciones', () => {
    fixture.detectChanges();
    const playlist = mockPlaylists[0];
    component.selectPlaylist(playlist);

    expect(component.selectedPlaylist).toBe(playlist);
    expect(component.playlistSongs.length).toBe(1);
    expect(component.playlistSongs[0].id).toBe(101);
  });

  it('debe agregar una canción a la playlist seleccionada exitosamente', () => {
    fixture.detectChanges();
    component.selectedPlaylist = { ...mockPlaylists[0], songs: [] }; // Playlist vacía
    const songIdToAdd = 102;
    
    playlistServiceSpy.addSongToPlaylist.and.returnValue(of({ ok: true, message: 'Added', data: null }));

    component.addSong(songIdToAdd);

    expect(playlistServiceSpy.addSongToPlaylist).toHaveBeenCalled();
    expect(notificationSpy.showSuccess).toHaveBeenCalled();
    // Verificamos actualización local
    expect(component.selectedPlaylist.songs.length).toBe(1);
    expect(component.selectedPlaylist.songs[0].id).toBe(102);
  });

  it('debe remover una canción de la playlist seleccionada', () => {
    fixture.detectChanges();
    const playlist = { ...mockPlaylists[0] };
    component.selectedPlaylist = playlist;
    const songIdToRemove = 101;

    playlistServiceSpy.removeSongFromPlaylist.and.returnValue(of({ ok: true, message: 'Removed', data: null }));

    component.removeSong(songIdToRemove);

    expect(playlistServiceSpy.removeSongFromPlaylist).toHaveBeenCalledWith(playlist.id, songIdToRemove);
    expect(component.selectedPlaylist.songs.length).toBe(0);
  });

  it('debe crear una nueva playlist', () => {
    fixture.detectChanges();
    component.openCreateModal();
    component.playlistForm.patchValue({ name: 'New Gym List', description: 'Workout' });
    
    playlistServiceSpy.createPlaylist.and.returnValue(of({ ok: true, message: 'Created', data: null }));

    component.savePlaylist();

    expect(playlistServiceSpy.createPlaylist).toHaveBeenCalled();
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Created');
  });

  it('debe actualizar una playlist existente', () => {
    fixture.detectChanges();
    const playlist = mockPlaylists[0];
    component.openEditModal(playlist);
    component.playlistForm.patchValue({ name: 'Updated Name' });

    playlistServiceSpy.updatePlaylist.and.returnValue(of({ ok: true, message: 'Updated', data: null }));

    component.savePlaylist();

    expect(playlistServiceSpy.updatePlaylist).toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
  });

  it('debe confirmar y eliminar una playlist', () => {
    fixture.detectChanges();
    const playlist = mockPlaylists[0];
    component.openDeleteConfirm(playlist);
    
    playlistServiceSpy.deletePlaylist.and.returnValue(of({ ok: true, message: 'Deleted', data: null }));

    component.confirmDelete();

    expect(playlistServiceSpy.deletePlaylist).toHaveBeenCalledWith(playlist.id);
    expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Playlist removed');
    expect(component.showDeleteModal).toBeFalse();
  });

  it('debe manejar errores al cargar playlists', () => {
    playlistServiceSpy.getUserPlaylists.and.returnValue(throwError(() => new Error('Server error')));
    fixture.detectChanges();

    expect(notificationSpy.showError).toHaveBeenCalledWith('Error loading playlists');
    expect(component.loading).toBeFalse();
  });
});