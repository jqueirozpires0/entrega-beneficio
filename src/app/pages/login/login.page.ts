import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Network } from '@capacitor/network';
import { NavController } from '@ionic/angular';
import {
  MaskitoOptions,
  MaskitoElementPredicate,
} from '@maskito/core';
import { StorageKeysEnums } from 'src/app/enums/StorageKeys.enums';
import { Mentor } from 'src/app/models/Mentor';
import { licencaMunicipioSistema } from 'src/app/models/Modelo';
import { servico } from 'src/app/models/Servico';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { formValidatorsUtils } from 'src/app/shared/utils/form-pattern-validators';

type IFormType = {
  usuario: any;
  senha: any;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  loginForm: FormGroup;

  usuarioLogado: any = null;

  logo = '';
  readonly cpfMask: MaskitoOptions = {
    mask: [
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  constructor(
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.loginForm = this.formBuilder.group<IFormType>({
      usuario: [
        '',
        [
          Validators.required,
          Validators.pattern(formValidatorsUtils.cpfValidator()),
        ],
      ],
      senha: ['', Validators.required],
    });
  }

  get usuario() {
    return this.loginForm.get('usuario');
  }
  get senha() {
    return this.loginForm.get('senha');
  }

  async ionViewDidEnter() {
    await this.recuperaUsuarioLogado();
    await this.recuperaLicenca();
  }

  async trocaMunicipio() {
    const licenca = await this.storageService.getValue<licencaMunicipioSistema>(StorageKeysEnums.licenca)
    if (licenca) {
      this.storageService.remove();
      this.navCtrl.navigateRoot('seleciona-municipio');
      return;
    }
  }

  async recuperaLicenca() {
    try {
      await this.loadingService.present();

      const licenca =
        await this.storageService.getValue<licencaMunicipioSistema>(
          StorageKeysEnums.licenca
        );

      Mentor.UrlRequest = 'https://treinamento.conectasuas.com.br/assistenciaSocial/';

      const requestParam = `varcodigoLicenca=${licenca.codigo}`;

      const licencaMunicipiosArray: licencaMunicipioSistema[] =
        Mentor.executaVisao(2632, requestParam);

      if (!licencaMunicipiosArray?.length) {
        this.navCtrl.navigateRoot('seleciona-municipio');
        return;
      }
      const licencaAtual = new licencaMunicipioSistema(
        licencaMunicipiosArray[0]
      );

      Mentor.UrlRequest = licencaAtual.url;

      this.logo = licencaAtual.logo as string;

      await this.storageService.setValue(
        StorageKeysEnums.licenca,
        licencaAtual
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.dismiss();
    }
  }

  async recuperaUsuarioLogado() {
    const usuarioLogado = await this.storageService.getValue<any>(
      StorageKeysEnums.usuarioLogado
    );

    if (!usuarioLogado) {
      return;
    }

    this.usuarioLogado = usuarioLogado;

    const { cpf, senha } = usuarioLogado;

    this.loginForm.setValue({ usuario: cpf, senha });
  }

  async realizaLogin() {
    try {
      await this.loadingService.present();
      const { connected: temInternet } = await Network.getStatus();

      if (!temInternet && this.usuarioLogado) {
        this.navCtrl.navigateRoot('validacao');
        return;
      }
      const usuario = Mentor.executaVisao(
        3215,
        'varlogi=' +
          this.usuario.value?.replace(/\D/g, '') +
          '&varsenha=' +
          this.senha.value
          + '&MwExibeSql=true'
      );

      if (!usuario) {
        this.toastService.showToast({ message: 'Usuário e senha incorretos!' });
        return;
      }

      await this.storageService.setValue(
        StorageKeysEnums.usuarioLogado, usuario
      );

      servico.usuarioLogado = usuario;

      this.navCtrl.navigateRoot('validacao');
    } catch (error) {
      this.toastService.showToast({ message: error });
    } finally {
      this.loadingService.dismiss();
    }
  }
}
