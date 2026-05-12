import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistManager } from './playlist-manager';

describe('PlaylistManager', () => {
  let component: PlaylistManager;
  let fixture: ComponentFixture<PlaylistManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
