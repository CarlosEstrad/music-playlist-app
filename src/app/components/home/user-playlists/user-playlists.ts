import { Component } from '@angular/core';
import { Playlist } from '../../../models/playlist';
import { PlaylistService } from '../../../core/services/Playlist/playlist-service';
import { NotificationService } from '../../../core/services/notifications/notification-service';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-playlists',
  imports: [
    CommonModule,
    UpperCasePipe,
    DatePipe
  ],
  templateUrl: './user-playlists.html',
  styleUrl: './user-playlists.css',
})
export class UserPlaylists {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  loading = false;

  constructor(
    private playlistService: PlaylistService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadAllPlaylists();
  }
  loadAllPlaylists(): void {
    this.loading = true;
    this.playlistService.getAllUserPlaylists().subscribe({
      next: (res) => {
        if (res.ok) {
          this.playlists = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.notification.showError('Error loading community playlists');
        this.loading = false;
      }
    });
  }

  viewPlaylistDetails(playlist: Playlist): void {
    this.selectedPlaylist = playlist;
  }

  closeDetails(): void {
    this.selectedPlaylist = null;
  }
}
