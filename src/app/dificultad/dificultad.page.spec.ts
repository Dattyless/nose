import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DificultadPage } from './dificultad.page';

describe('DificultadPage', () => {
  let component: DificultadPage;
  let fixture: ComponentFixture<DificultadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DificultadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
