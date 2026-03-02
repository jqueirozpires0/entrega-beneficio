import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidacaoPage } from './validacao.page';

describe('ValidacaoPage', () => {
  let component: ValidacaoPage;
  let fixture: ComponentFixture<ValidacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
