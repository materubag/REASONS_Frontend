import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorForm } from './investigador-form';

describe('InvestigadorForm', () => {
  let component: InvestigadorForm;
  let fixture: ComponentFixture<InvestigadorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
