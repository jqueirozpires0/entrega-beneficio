import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StorageKeysEnums } from 'src/app/enums/StorageKeys.enums';
import { Mentor } from 'src/app/models/Mentor';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

type IFormType = {
  estado: any;
  municipio: any;
};

@Component({
  selector: 'app-seleciona-municipio',
  templateUrl: './seleciona-municipio.page.html',
  styleUrls: ['./seleciona-municipio.page.scss'],
  standalone: false
})
export class SelecionaMunicipioPage implements OnInit {
  listaEstado: any[] = [];
  listaMunicipios = new Array();

  licencaForm: FormGroup;

  constructor(
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.licencaForm = this.formBuilder.group<IFormType>({
      estado: [null, Validators.required],
      municipio: ['', Validators.required],
    });
  }

  get estado() {
    return this.licencaForm.get('estado');
  }
  get municipio() {
    return this.licencaForm.get('municipio');
  }

  ngOnInit() {
    this.estado?.valueChanges.subscribe((estado) => {
      if (!estado.codigo) {
        this.municipio?.disable();
      } else {
        this.municipio?.enable();
      }
    });
  }

  async ionViewWillEnter() {
    const licenca = await this.storageService.getValue(
      StorageKeysEnums.licenca
    );

    if (licenca) {
      this.navCtrl.navigateRoot('login');
      return;
    }
    this.listarEstado();
  }

  async listarEstado() {
    try {
      Mentor.UrlRequest = 'https://treinamento.conectasuas.com.br/assistenciaSocial/';
      await this.loadingService.present();
      this.listaEstado = Mentor.executaVisao(314, '');
    } catch (error) {
      this.toastService.showToast({ message: error, cssClass: 'toast-error' });
    } finally {
      this.loadingService.dismiss();
    }
  }

  async listarMunicipios() {
    try {
      await this.loadingService.present();

      this.listaMunicipios = Mentor.executaVisao(
        2890,
        'varEstado=' + this.estado.value.codigo + '&varSistema=1'
      );
    } catch (error) {
      this.toastService.showToast({ message: error, cssClass: 'toast-error' });
    } finally {
      this.loadingService.dismiss();
    }
  }

  async navegaParaLogin() {
    Mentor.UrlRequest = this.municipio!.value.url;

    await this.storageService.setValue(
      StorageKeysEnums.licenca,
      this.municipio!.value
    );
    this.navCtrl.navigateRoot('login');
  }
}
