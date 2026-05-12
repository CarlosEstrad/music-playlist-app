import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reply } from '../../../models/helpers'; // Tu interfaz estandarizada
import { 
  Playlist, 
  PlaylistRegistre, 
  PlaylistUpdate, 
  AddSongDto 
} from '../../../models/playlist';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  // Ajustado a la ruta de tu controlador [Route("api/[controller]")]
  private url = `${environment.apiUrl}/api/Playlist`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las playlists específicas del usuario autenticado (ID extraído del Token en .NET)
   */
  getUserPlaylists(): Observable<Reply<Playlist[]>> {
    return this.http.get<Reply<Playlist[]>>(`${this.url}/GetUserPlaylists`);
  }

  /**
   * Obtiene todas las playlists del sistema
   */
  getAllUserPlaylists(): Observable<Reply<Playlist[]>> {
    return this.http.get<Reply<Playlist[]>>(`${this.url}/GetAllUserPlaylists`);
  }

  /**
   * Crea una nueva playlist
   */
  createPlaylist(dto: PlaylistRegistre): Observable<Reply<any>> {
    return this.http.post<Reply<any>>(`${this.url}/CreatePlaylist`, dto);
  }

  /**
   * Actualiza una playlist existente (Envia el Id dentro del DTO)
   */
  updatePlaylist(dto: PlaylistUpdate): Observable<Reply<any>> {
    return this.http.put<Reply<any>>(`${this.url}/UpdatePlaylist`, dto);
  }

  /**
   * Elimina una playlist por su ID
   */
  deletePlaylist(id: number): Observable<Reply<any>> {
    return this.http.delete<Reply<any>>(`${this.url}/DeletePlaylist/${id}`);
  }

  /**
   * Asocia una canción a una playlist
   */
  addSongToPlaylist(dto: AddSongDto): Observable<Reply<any>> {
    return this.http.post<Reply<any>>(`${this.url}/AddSongToPlaylist`, dto);
  }

  /**
   * Remueve la relación entre una canción y una playlist
   */
  removeSongFromPlaylist(playlistId: number, songId: number): Observable<Reply<any>> {
    return this.http.delete<Reply<any>>(`${this.url}/RemoveSongFromPlaylist/${playlistId}/${songId}`);
  }
}