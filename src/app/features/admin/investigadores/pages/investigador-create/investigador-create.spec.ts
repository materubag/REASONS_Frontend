import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorCreate } from './investigador-create';

describe('InvestigadorCreate', () => {
  let component: InvestigadorCreate;
  let fixture: ComponentFixture<InvestigadorCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadorCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadorCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
