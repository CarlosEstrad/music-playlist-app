import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Song } from '../../../models/songs';
import { SongService } from '../../../core/services/Songs/song-service';
import { NotificationService } from '../../../core/services/notifications/notification-service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './songs.html',
  styleUrls: ['./songs.css']
})
export class Songs implements OnInit {
  songs: Song[] = [];
  songForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  loading = false;
  isDeleteModalOpen = false;
  songToDelete: Song | null = null;

  constructor(
    private songService: SongService,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    // Definición del Formulario Reactivo
    this.songForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(2)]],
      artist: ['', [Validators.required]],
      album: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.loading = true;
    this.songService.getAllSongs().subscribe({
      next: (res) => {
        if (res.ok) this.songs = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.songForm.reset({ id: 0 });
    this.isModalOpen = true;
  }

  openEditModal(song: Song): void {
    this.isEditing = true;
    const durationInSeconds = this.timeToSeconds(song.duration as unknown as string);

    this.songForm.patchValue({
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: durationInSeconds
    });
    this.isModalOpen = true;
  }

  private timeToSeconds(timeStr: string): number {
    if (!timeStr || !timeStr.includes(':')) return 0;

    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes * 60) + seconds;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveSong(): void {
    if (this.songForm.invalid) {
      this.songForm.markAllAsTouched();
      return;
    }

    const songData = this.songForm.value;
    const request = this.isEditing
      ? this.songService.updateSong(songData)
      : this.songService.createSong(songData);

    request.subscribe({
      next: (res) => {
        if (res.ok) {
          this.notification.showSuccess(res.message || 'Operation successful!');
          this.loadSongs();
          this.closeModal();
        }
      }
    });
  }

  // 1. Abre el modal 
  deleteSong(song: Song): void {
    this.songToDelete = song;
    this.isDeleteModalOpen = true;
  }

  // 2. Cierra el modal
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.songToDelete = null;
  }

  // 3. Ejecuta la eliminación real
  confirmDelete(): void {
    if (this.songToDelete) {
      this.songService.deleteSong(this.songToDelete.id).subscribe({
        next: (res) => {
          if (res.ok) {
            this.loadSongs();
            this.notification.showSuccess(res.message || 'Song deleted successfully');
            this.closeDeleteModal();
          }
        },
        error: (err) => {
          this.notification.showError('Could not delete the song.');
        }
      });
    }
  }
}