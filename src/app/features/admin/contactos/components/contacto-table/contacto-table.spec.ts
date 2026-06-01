import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoTable } from './contacto-table';

describe('ContactoTable', () => {
  let component: ContactoTable;
  let fixture: ComponentFixture<ContactoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactoTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
