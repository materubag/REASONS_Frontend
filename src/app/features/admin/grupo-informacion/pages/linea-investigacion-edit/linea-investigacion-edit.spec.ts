import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaInvestigacionEdit } from './linea-investigacion-edit';

describe('LineaInvestigacionEdit', () => {
  let component: LineaInvestigacionEdit;
  let fixture: ComponentFixture<LineaInvestigacionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineaInvestigacionEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(LineaInvestigacionEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
