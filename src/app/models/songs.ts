export interface Song {
    id: number;          // Opcional porque al crear una nueva, el ID lo asigna la DB
    title: string;
    artist: string;
    album: string;
    duration: string;
}
