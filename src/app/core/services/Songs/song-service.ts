import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData, Reply } from '../../../models/helpers';
import { Song } from '../../../models/songs';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private url = `${environment.apiUrl}/api/Song`;

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<any> {
    return this.http.get<Reply<LoginData>>(`${this.url}/GetAllSongs`);
  }

  createSong(song: Song): Observable<any> {
    return this.http.post<Reply<LoginData>>(`${this.url}/CreateSong`, song);
  }

  updateSong(song: Song): Observable<any> {
    return this.http.put<Reply<LoginData>>(`${this.url}/UpdateSong`, song);
  }

  deleteSong(id: number): Observable<any> {
    return this.http.delete<Reply<LoginData>>(`${this.url}/DeleteSong/${id}`);
  }
}
