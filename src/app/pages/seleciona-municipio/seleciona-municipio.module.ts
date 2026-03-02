import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelecionaMunicipioPageRoutingModule } from './seleciona-municipio-routing.module';

import { SelecionaMunicipioPage } from './seleciona-municipio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelecionaMunicipioPageRoutingModule,
  ],
  declarations: [SelecionaMunicipioPage],
})
export class SelecionaMunicipioPageModule {}
