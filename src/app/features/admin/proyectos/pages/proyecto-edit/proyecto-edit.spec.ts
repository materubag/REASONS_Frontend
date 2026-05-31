import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoEdit } from './proyecto-edit';

describe('ProyectoEdit', () => {
  let component: ProyectoEdit;
  let fixture: ComponentFixture<ProyectoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectoEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
