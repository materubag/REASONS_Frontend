import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesList } from './publicaciones-list';

describe('PublicacionesList', () => {
  let component: PublicacionesList;
  let fixture: ComponentFixture<PublicacionesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesList],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
