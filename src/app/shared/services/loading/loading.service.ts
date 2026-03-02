import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingCtrl: LoadingController) {}

  async present(props?: LoadingOptions): Promise<void> {
    const loading = await this.loadingCtrl.create({
      cssClass: '',
      message: 'Carregando',
      ...props,
    });

    await loading.present();
  }

  dismiss(): void {
    this.loadingCtrl.dismiss();
  }
}
