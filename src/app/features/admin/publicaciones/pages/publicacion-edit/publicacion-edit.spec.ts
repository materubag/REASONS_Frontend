import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionEdit } from './publicacion-edit';

describe('PublicacionEdit', () => {
  let component: PublicacionEdit;
  let fixture: ComponentFixture<PublicacionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
