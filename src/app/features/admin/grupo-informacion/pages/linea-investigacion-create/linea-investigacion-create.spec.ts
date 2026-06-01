import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaInvestigacionCreate } from './linea-investigacion-create';

describe('LineaInvestigacionCreate', () => {
  let component: LineaInvestigacionCreate;
  let fixture: ComponentFixture<LineaInvestigacionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineaInvestigacionCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(LineaInvestigacionCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
