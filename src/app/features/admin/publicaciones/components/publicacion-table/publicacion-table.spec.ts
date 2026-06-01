import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionTable } from './publicacion-table';

describe('PublicacionTable', () => {
  let component: PublicacionTable;
  let fixture: ComponentFixture<PublicacionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
