import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylists } from './user-playlists';

describe('UserPlaylists', () => {
  let component: UserPlaylists;
  let fixture: ComponentFixture<UserPlaylists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaylists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPlaylists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
