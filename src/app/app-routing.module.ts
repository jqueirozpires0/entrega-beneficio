import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'seleciona-municipio',
    pathMatch: 'full',
  },
  {
    path: 'seleciona-municipio',
    loadChildren: () =>
      import('./pages/seleciona-municipio/seleciona-municipio.module').then(
        (m) => m.SelecionaMunicipioPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'validacao',
    loadChildren: () => import('./pages/validacao/validacao.module').then( m => m.ValidacaoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
