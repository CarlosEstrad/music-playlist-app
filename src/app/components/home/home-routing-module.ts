import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home';
import { PlaylistManager } from './playlist-manager/playlist-manager';
import { UserPlaylists } from './user-playlists/user-playlists';
import { Songs } from './songs/songs';

const routes: Routes = [
  {
    path: '', 
    component: Home,
    children: [
      { path: 'songs', component: Songs },
      { path: 'manage-playlists', component: PlaylistManager },
      { path: 'my-stats', component: UserPlaylists },
      { path: '', redirectTo: 'songs', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }