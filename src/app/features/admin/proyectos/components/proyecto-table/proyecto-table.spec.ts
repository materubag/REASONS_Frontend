import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoTable } from './proyecto-table';

describe('ProyectoTable', () => {
  let component: ProyectoTable;
  let fixture: ComponentFixture<ProyectoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectoTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
