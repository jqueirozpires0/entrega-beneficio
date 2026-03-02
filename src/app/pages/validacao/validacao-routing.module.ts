import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidacaoPage } from './validacao.page';

const routes: Routes = [
  {
    path: '',
    component: ValidacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidacaoPageRoutingModule {}
