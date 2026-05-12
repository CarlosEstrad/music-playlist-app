import { Song } from "./songs";

export interface Playlist {
  id: number;
  name: string;
  description?: string; // El ? indica que puede ser null/undefined
  userId: number;
  createdAt: string | Date;
  
  // Relaciones transformadas
  user?: {
    username: string;
    email: string;
  };
  songs: Song[]; // Aquí es donde caerán las canciones agrupadas
}

export interface PlaylistDto {
    id: number;
    userId: number;
    name: string;
    description: string;
    createdAt: string | Date;
    username: string;
    email: string;
    idSong: number;
    album: string;
    artist: string;
    title: string;
    duration: string;
}


export interface PlaylistRegistre {
    name: string;
    description: string;
}


export interface PlaylistUpdate extends PlaylistRegistre {
    id: number;
}


export interface AddSongDto {
    playlistId: number;
    songId: number;
}


export interface Reply<T> {
    ok: boolean;
    message: string;
    data: T;
}