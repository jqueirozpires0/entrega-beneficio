import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecionaMunicipioPage } from './seleciona-municipio.page';

const routes: Routes = [
  {
    path: '',
    component: SelecionaMunicipioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionaMunicipioPageRoutingModule {}
