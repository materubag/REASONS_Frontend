import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorTable } from './investigador-table';

describe('InvestigadorTable', () => {
  let component: InvestigadorTable;
  let fixture: ComponentFixture<InvestigadorTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadorTable],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadorTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
