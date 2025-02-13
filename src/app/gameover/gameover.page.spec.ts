import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameoverPage } from './gameover.page';

describe('GameoverPage', () => {
  let component: GameoverPage;
  let fixture: ComponentFixture<GameoverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
