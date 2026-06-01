import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaInvestigacionList } from './linea-investigacion-list';

describe('LineaInvestigacionList', () => {
  let component: LineaInvestigacionList;
  let fixture: ComponentFixture<LineaInvestigacionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineaInvestigacionList],
    }).compileComponents();

    fixture = TestBed.createComponent(LineaInvestigacionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
