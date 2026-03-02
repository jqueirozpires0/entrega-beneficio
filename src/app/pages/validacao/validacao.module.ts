import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidacaoPageRoutingModule } from './validacao-routing.module';

import { ValidacaoPage } from './validacao.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidacaoPageRoutingModule,
    MaskitoDirective
  ],
  declarations: [ValidacaoPage]
})
export class ValidacaoPageModule {}
