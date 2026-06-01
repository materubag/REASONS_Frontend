import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoCreate } from './proyecto-create';

describe('ProyectoCreate', () => {
  let component: ProyectoCreate;
  let fixture: ComponentFixture<ProyectoCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
