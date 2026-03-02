import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Mentor } from 'src/app/models/Mentor';
import {
  ArquivoBeneficio,
  BeneficiosDiversos
} from 'src/app/models/Modelo';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ScannerService } from 'src/app/shared/services/scanner/scanner.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.page.html',
  styleUrls: ['./validacao.page.scss'],
})
export class ValidacaoPage implements OnDestroy {
  isCameraSupported = true;

  cpfInput: string = '';
  onlineCounter = 0;
  offlineCounter = 0;

  entregasOffline: Array<string> = [];

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
    private readonly storageService: StorageService,
    private readonly scannerService: ScannerService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  @ViewChild(IonModal) modal: IonModal;

  ngOnDestroy(): void {
    this.scannerService.stopScan();
  }

  async ionViewDidEnter() {
    await this.atualizaOnlineCounter();
    await this.checkCameraSupport();
  }

  logout() {
    this.storageService.remove();
    this.navCtrl.navigateRoot('seleciona-municipio');
  }

  entregaSemCartao() {
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancelar');
  }

  async checkCameraSupport() {
    this.isCameraSupported = await this.scannerService.shouldSupportCamera();
  }

  async startScan() {
    try {
      await this.loadingService.present();

      await this.scannerService.baixaGoogleScannerModule();
    } finally {
      this.loadingService.dismiss();
    }
    const scannedCode = await this.scannerService.startScan();

    if (!scannedCode) {
      return;
    }

    const parsedScannedCode = scannedCode?.replace('.', '');

    await this.validaCodigo(parsedScannedCode);
  }

  async validaCpf() {
    if (!this.cpfInput) {
      this.toastService.showToast({
        message: `Sem CPF`,
      });
      return;
    }
    const cpfSemMascara = this.cpfInput?.replace(/\D/g, '');
    await this.validaCodigo(cpfSemMascara);
  }

  async validaCodigo(codigo: string) {
    try {
      await this.loadingService.present();
      await this.validaCodigoOnline(codigo);
    } catch (error) {
      this.toastService.showToast({ message: error });
    } finally {
      this.loadingService.dismiss();
      this.modal.dismiss(null, 'cancelar');
    }
  }

  async validaCodigoOnline(codigo: string, sincroniza = false) {
    try {
      let param = '';
      if (codigo.length === 11) {
        param = ` varcpf=${codigo}&varsituacao=5`;
      } else {
        param = `varcodigoAssociadoCras=${codigo}&varsituacao=5`;
      }

      const retornoJsp: any = Mentor.bind(
        param,
        'jsp/appEntregaBeneficioDiversos/validaEntregaBeneficioDiverso.jsp',
        'POST'
      );

      const objJsp = JSON.parse(retornoJsp);

      const checaBeneficio = JSON.parse(objJsp['beneficioDiverso']);
      console.log('checaBeneficio', checaBeneficio);

      if (checaBeneficio == null || checaBeneficio.length === 0) {
        this.toastService.showToast({
          message: `Usuário não encontrado - ${codigo}`,
        });
        return;
      }

      const obj: BeneficiosDiversos = new BeneficiosDiversos(checaBeneficio[0]);
      const arquivoEnvio = {
        descricao: 'Foto da Entrega',
        flagUpoload: 1,
        extensao: '.png',
      };
      const arquivo: ArquivoBeneficio = new ArquivoBeneficio(arquivoEnvio);
      const imagem = Mentor.rodaTransacaoFromObjeto(2009, 'objArquivoBeneficio', arquivo, true);
      obj.situacao = 8;
      obj.arquivos = [imagem['ArquivoBeneficio']];
      this.loadingService.dismiss();


      const resultado = Mentor.rodaTransacaoFromObjeto(2008, 'objEntregaBeneficioDiverso', obj, true);

      const alerta = await this.alertController.create({
        header: 'Foto da Entrega',
        cssClass: 'agendamento-alert',
        message:
          `Realizar foto da entrega`,
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              await this.salvarFoto(imagem['ArquivoBeneficio'].codigo);
            },
          },
        ],
      });
      await alerta.present();
      await alerta.onDidDismiss();
      if (!sincroniza) {
        await this.toastService.showToast({
          message: `Entrega efetuada com sucesso`,
          cssClass: 'toast-success',
        });
      }
      await this.atualizaOnlineCounter();
    } catch (error) {
      throw new Error(`Erro no código: ${codigo} - ${error}`);
    }
  }

  async salvarFoto(codigo: string) {
    try {
      const cameraResults: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      const response = await fetch(cameraResults.webPath!);
      const blob = await response.blob();
      let formData = new FormData();
      formData.append('arquivo', blob);
      formData.append('varCodigo', codigo + '');
      formData.append('extensaoFoto', '.png');

      var oReq = new XMLHttpRequest();
      oReq.open(
        'POST',
        Mentor.UrlRequest + 'jsp/salvarFotoBeneficioDiversoApp.jsp',
        true
      );
      oReq.send(formData);

    } catch (error) {
      console.error('Erro ao salvar foto:', error);
    }
  }

  async atualizaOnlineCounter() {
    try {
      let param = `varsituacao=8`;
      const retorno: any = Mentor.bind(
        param,
        'jsp/appEntregaBeneficioDiversos/totalDiario.jsp',
        'POST'
      );

      const parsedObj = JSON.parse(retorno);

      this.onlineCounter = parsedObj.totalEntregasDiarias;
    } catch (error) {
      console.error(error);
    }
  }
}
