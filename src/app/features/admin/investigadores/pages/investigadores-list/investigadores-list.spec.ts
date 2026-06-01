import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadoresList } from './investigadores-list';

describe('InvestigadoresList', () => {
  let component: InvestigadoresList;
  let fixture: ComponentFixture<InvestigadoresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadoresList],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigadoresList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
