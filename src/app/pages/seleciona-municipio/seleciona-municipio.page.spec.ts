import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionaMunicipioPage } from './seleciona-municipio.page';

describe('SelecionaMunicipioPage', () => {
  let component: SelecionaMunicipioPage;
  let fixture: ComponentFixture<SelecionaMunicipioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionaMunicipioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
