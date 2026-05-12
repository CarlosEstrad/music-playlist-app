import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlaylistService } from './playlist-service';
import { environment } from '../../../../environments/environment';
import { Playlist, PlaylistRegistre, PlaylistUpdate, AddSongDto } from '../../../models/playlist';
import { Reply } from '../../../models/helpers';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/Playlist`;

  const mockPlaylists: Playlist[] = [
    { id: 1, name: 'Rock Classics', description: 'Best of 70s', songs: [], createdAt: new Date(), userId: 1 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlaylistService]
    });
    service = TestBed.inject(PlaylistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener las playlists del usuario (getUserPlaylists)', () => {
    const mockResponse: Reply<Playlist[]> = { ok: true, data: mockPlaylists, message: 'Success' };

    service.getUserPlaylists().subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.data.length).toBe(1);
      expect(res.data[0].name).toBe('Rock Classics');
    });

    const req = httpMock.expectOne(`${apiUrl}/GetUserPlaylists`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener todas las playlists del sistema (getAllUserPlaylists)', () => {
    const mockResponse: Reply<Playlist[]> = { ok: true, data: mockPlaylists, message: 'Success' };

    service.getAllUserPlaylists().subscribe(res => {
      expect(res.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/GetAllUserPlaylists`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe crear una nueva playlist (createPlaylist)', () => {
    const newPlaylist: PlaylistRegistre = { name: 'Gym', description: 'Workout' };
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Playlist created' };

    service.createPlaylist(newPlaylist).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('Playlist created');
    });

    const req = httpMock.expectOne(`${apiUrl}/CreatePlaylist`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlaylist);
    req.flush(mockResponse);
  });

  it('debe actualizar una playlist (updatePlaylist)', () => {
    const updateDto: PlaylistUpdate = { id: 1, name: 'Updated Name', description: 'Updated Desc' };
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Updated' };

    service.updatePlaylist(updateDto).subscribe(res => {
      expect(res.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/UpdatePlaylist`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('debe eliminar una playlist (deletePlaylist)', () => {
    const playlistId = 1;
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Deleted' };

    service.deletePlaylist(playlistId).subscribe(res => {
      expect(res.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/DeletePlaylist/${playlistId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('debe agregar una canción a la playlist (addSongToPlaylist)', () => {
    const dto: AddSongDto = { playlistId: 1, songId: 10 };
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Song added' };

    service.addSongToPlaylist(dto).subscribe(res => {
      expect(res.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/AddSongToPlaylist`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debe remover una canción de la playlist (removeSongFromPlaylist)', () => {
    const pId = 1;
    const sId = 10;
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Removed' };

    service.removeSongFromPlaylist(pId, sId).subscribe(res => {
      expect(res.ok).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/RemoveSongFromPlaylist/${pId}/${sId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});