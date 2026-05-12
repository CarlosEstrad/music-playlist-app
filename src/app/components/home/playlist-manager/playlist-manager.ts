import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Playlist } from '../../../models/playlist';
import { Song } from '../../../models/songs'; // Asegúrate de tener el modelo de canciones
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { PlaylistService } from '../../../core/services/Playlist/playlist-service';
import { SongService } from '../../../core/services/Songs/song-service';

@Component({
  selector: 'app-playlist-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './playlist-manager.html',
  styleUrl: './playlist-manager.css',
})
export class PlaylistManager implements OnInit {
  playlists: Playlist[] = [];
  playlistForm!: FormGroup;

  // Variables para la gestión de canciones (Lo que faltaba)
  selectedPlaylist: Playlist | null = null;
  playlistSongs: Song[] = [];
  allAvailableSongs: Song[] = [];

  // Estados de UI
  isModalOpen = false;
  isEditing = false;
  selectedPlaylistId: number | null = null;
  loading = false;
  showDeleteModal = false;
  playlistToDelete: Playlist | null = null;

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private songService: SongService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPlaylists();
    this.loadAllSongs(); // Cargamos todas las canciones del sistema al iniciar
  }

  initForm(): void {
    this.playlistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  // --- LÓGICA DE PLAYLISTS ---

  loadPlaylists(): void {
    this.loading = true;
    this.playlistService.getUserPlaylists().subscribe({
      next: (res) => {
        if (res.ok) this.playlists = res.data;
        this.loading = false;
      },
      error: () => {
        this.notification.showError('Error loading playlists');
        this.loading = false;
      }
    });
  }

  loadAllSongs(): void {
    this.songService.getAllSongs().subscribe({
      next: (res) => {
        if (res.ok) this.allAvailableSongs = res.data;
      }
    });
  }

  // --- LÓGICA DE GESTIÓN DE CANCIONES (MASTER-DETAIL) ---

  selectPlaylist(playlist: Playlist): void {
    this.selectedPlaylist = playlist;
    // Aquí podrías llamar a un servicio que traiga las canciones de esa playlist específica
    // Si tu objeto playlist ya las trae en una propiedad 'songs', úsala:
    this.playlistSongs = (playlist as any).songs || [];

    // Si tu API requiere una petición aparte para ver canciones de la playlist:
    // this.loadSongsByPlaylist(playlist.id);
  }

  addSong(songId: number): void {
    if (!this.selectedPlaylist) return;

    const dto = {
      playlistId: this.selectedPlaylist.id,
      songId: songId
    };

    this.playlistService.addSongToPlaylist(dto).subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess(res.message || 'Song added');

          // --- ACTUALIZACIÓN LOCAL ---
          // Buscamos el objeto completo de la canción en nuestra lista general
          const songToAdd = this.allAvailableSongs.find(s => s.id === songId);

          if (songToAdd && this.selectedPlaylist) {
            // 1. La agregamos al arreglo de la playlist seleccionada
            this.selectedPlaylist.songs.push(songToAdd);

            // 2. Sincronizamos la lista que ve el HTML
            this.playlistSongs = [...this.selectedPlaylist.songs];
          }
        } else {
          this.notification.showError(res.message);
        }
      }
    });
  }

  removeSong(songId: number): void {
    if (!this.selectedPlaylist) return;

    this.playlistService.removeSongFromPlaylist(this.selectedPlaylist.id, songId).subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess('Song removed');

          // --- ACTUALIZACIÓN LOCAL ---
          if (this.selectedPlaylist) {
            // 1. Filtramos la canción de la lista del objeto padre
            this.selectedPlaylist.songs = this.selectedPlaylist.songs.filter(s => s.id !== songId);

            // 2. Actualizamos la referencia para que Angular detecte el cambio
            this.playlistSongs = [...this.selectedPlaylist.songs];
          }
        }
      }
    });
  }

  // --- MÉTODOS DE MODAL (UI) ---

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedPlaylistId = null;
    this.playlistForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(playlist: Playlist): void {
    this.isEditing = true;
    this.selectedPlaylistId = playlist.id;
    this.playlistForm.patchValue({
      name: playlist.name,
      description: playlist.description
    });
    this.isModalOpen = true;
  }

  openDeleteConfirm(playlist: Playlist): void {
    this.playlistToDelete = playlist;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.playlistToDelete = null;
  }

  confirmDelete(): void {
    if (this.playlistToDelete) {
      this.deletePlaylist(this.playlistToDelete);
      this.closeDeleteModal();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  savePlaylist(): void {
    if (this.playlistForm.invalid) return;

    if (this.isEditing && this.selectedPlaylistId) {
      const updateDto = { id: this.selectedPlaylistId, ...this.playlistForm.value };
      this.playlistService.updatePlaylist(updateDto).subscribe({
        next: (res) => this.handleSuccess(res.message),
        error: (err) => this.notification.showError(err.error?.message || 'Update failed')
      });
    } else {
      this.playlistService.createPlaylist(this.playlistForm.value).subscribe({
        next: (res) => this.handleSuccess(res.message),
        error: (err) => this.notification.showError(err.error?.message || 'Creation failed')
      });
    }
  }

  private handleSuccess(message: string): void {
    this.notification.showSuccess(message || 'Success!');
    this.loadPlaylists();
    this.closeModal();
  }

  deletePlaylist(playlist: Playlist): void {
    this.playlistService.deletePlaylist(playlist.id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess('Playlist removed');
          if (this.selectedPlaylist?.id === playlist.id) this.selectedPlaylist = null;
          this.loadPlaylists();
        }
      }
    });
  }
}