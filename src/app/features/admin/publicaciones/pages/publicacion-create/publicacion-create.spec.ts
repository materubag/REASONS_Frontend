import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionCreate } from './publicacion-create';

describe('PublicacionCreate', () => {
  let component: PublicacionCreate;
  let fixture: ComponentFixture<PublicacionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
