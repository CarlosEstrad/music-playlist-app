import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SongService } from './song-service';
import { environment } from '../../../../environments/environment';
import { Song } from '../../../models/songs';
import { Reply } from '../../../models/helpers';

describe('SongService', () => {
  let service: SongService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/Song`;

  const mockSongs: Song[] = [
    { id: 1, title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration: '3:03' },
    { id: 2, title: 'Starman', artist: 'David Bowie', album: 'Ziggy Stardust', duration: '4:10' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SongService]
    });
    service = TestBed.inject(SongService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener todas las canciones (getAllSongs)', () => {
    const mockResponse: Reply<Song[]> = { ok: true, data: mockSongs, message: 'Success' };

    service.getAllSongs().subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.data.length).toBe(2);
      expect(res.data[0].title).toBe('Imagine');
    });

    const req = httpMock.expectOne(`${apiUrl}/GetAllSongs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe crear una nueva canción (createSong)', () => {
    const newSong: Song = { id: 0, title: 'New Song', artist: 'Artist', album: 'Album', duration: '3:00' };
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Song created' };

    service.createSong(newSong).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('Song created');
    });

    const req = httpMock.expectOne(`${apiUrl}/CreateSong`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSong);
    req.flush(mockResponse);
  });

  it('debe actualizar una canción existente (updateSong)', () => {
    const songToUpdate: Song = { id: 1, title: 'Updated Song', artist: 'Artist', album: 'Album', duration: '3:00' };
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Song updated' };

    service.updateSong(songToUpdate).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('Song updated');
    });

    const req = httpMock.expectOne(`${apiUrl}/UpdateSong`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(songToUpdate);
    req.flush(mockResponse);
  });

  it('debe eliminar una canción por ID (deleteSong)', () => {
    const songId = 1;
    const mockResponse: Reply<any> = { ok: true, data: null, message: 'Song deleted' };

    service.deleteSong(songId).subscribe(res => {
      expect(res.ok).toBeTrue();
      expect(res.message).toBe('Song deleted');
    });

    const req = httpMock.expectOne(`${apiUrl}/DeleteSong/${songId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});