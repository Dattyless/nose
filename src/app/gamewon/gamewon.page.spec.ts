import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamewonPage } from './gamewon.page';

describe('GamewonPage', () => {
  let component: GamewonPage;
  let fixture: ComponentFixture<GamewonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GamewonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
