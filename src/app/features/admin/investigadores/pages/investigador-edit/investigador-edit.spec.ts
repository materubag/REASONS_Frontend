import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorEdit } from './investigador-edit';

describe('InvestigadorEdit', () => {
  let component: InvestigadorEdit;
  let fixture: ComponentFixture<InvestigadorEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadorEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadorEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
