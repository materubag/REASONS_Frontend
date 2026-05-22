import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadoresPage } from './investigadores-page';

describe('InvestigadoresPage', () => {
  let component: InvestigadoresPage;
  let fixture: ComponentFixture<InvestigadoresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadoresPage],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadoresPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
