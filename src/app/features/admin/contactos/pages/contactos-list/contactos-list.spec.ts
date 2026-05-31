import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosList } from './contactos-list';

describe('ContactosList', () => {
  let component: ContactosList;
  let fixture: ComponentFixture<ContactosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactosList],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
