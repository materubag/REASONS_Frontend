import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoInformacionEdit } from './grupo-informacion-edit';

describe('GrupoInformacionEdit', () => {
  let component: GrupoInformacionEdit;
  let fixture: ComponentFixture<GrupoInformacionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoInformacionEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoInformacionEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
