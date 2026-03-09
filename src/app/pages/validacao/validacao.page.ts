import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Mentor } from 'src/app/models/Mentor';
import { ArquivoBeneficio, BeneficiosDiversos } from 'src/app/models/Modelo';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ScannerService } from 'src/app/shared/services/scanner/scanner.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { servico } from 'src/app/models/Servico';
import { StorageKeysEnums } from 'src/app/enums/StorageKeys.enums';
import { Network } from '@capacitor/network';

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
  status = null;
  listaBeneficiarios = servico.beneficios;

  readonly cpfMask: MaskitoOptions = {
    mask: [
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '-',
      /\d/, /\d/
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  constructor(
    private storageService: StorageService,
    private scannerService: ScannerService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  @ViewChild(IonModal) modal: IonModal;

  ngOnDestroy(): void {
    this.scannerService.stopScan();
  }

  async ionViewDidEnter() {
    const entregas =
      await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      );

    this.offlineCounter = entregas?.length ?? 0;

    await this.atualizaOnlineCounter();
    await this.checkCameraSupport();
  }

  async atualizarTela(event: any) {
    window.location.reload();
    event.target.complete();
  }

  logout() {
    this.storageService.setValue(StorageKeysEnums.usuarioLogado, []);
    this.navCtrl.navigateRoot('seleciona-municipio');
  }

  entregaSemCartao() {
    this.modal.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancelar');
  }

  async checkCameraSupport() {
    this.isCameraSupported =
      await this.scannerService.shouldSupportCamera();
  }

  async startScan() {

    try {

      await this.loadingService.present();

      await this.scannerService.baixaGoogleScannerModule();

    } finally {

      this.loadingService.dismiss();

    }

    const scannedCode =
      await this.scannerService.startScan();

    if (!scannedCode) return;

    const parsedCode = scannedCode.replace('.', '');

    await this.validaCodigo(parsedCode);

  }

  async validaCpf() {

    if (!this.cpfInput) {

      this.toastService.showToast({
        message: `Sem CPF`,
      });

      return;

    }

    const cpf = this.cpfInput.replace(/\D/g, '');

    await this.validaCodigo(cpf);

  }

  async validaCodigo(codigo: string) {
    try {
      await this.loadingService.present();
      await this.validaCodigoOnline(codigo);
    } catch (error) {
      this.toastService.showToast({ message: error });
    } finally {
      this.loadingService.dismiss();
      this.cpfInput = '';
      this.modal.dismiss(null, 'cancelar');
    }
  }

  async validaCodigoOnline(
    codigo: string,
    sincroniza = true,
    blobFoto?: Blob
  ) {

    try {
      const codigoLimpo = codigo.replace(/\D/g, '');
      let checaBeneficio = this.listaBeneficiarios.find(
        (beneficio) =>
          beneficio.cpf.replace(/\D/g, '') === codigoLimpo
      );


      if (checaBeneficio?.situacao === 8) {

        this.toastService.showToast({
          message: `Usuário ${checaBeneficio.nome} já recebeu o benefício`,
        });

        return;

      }

      if (!checaBeneficio) {

        this.toastService.showToast({
          message: `Usuário não encontrado - ${codigo}`,
        });

        return;

      }

      this.status = await Network.getStatus();

      if (!this.status.connected) {

        await this.salvarFoto(codigo);

        this.toastService.showToast({
          message: `Entrega salva offline`,
          cssClass: 'toast-success',
        });

        return;

      }

      const obj: BeneficiosDiversos =
        new BeneficiosDiversos(checaBeneficio[0]);

      const arquivoEnvio = {
        descricao: 'Foto da Entrega',
        flagUpoload: 1,
        extensao: '.png',
      };

      const arquivo =
        new ArquivoBeneficio(arquivoEnvio);

      const imagem =
        Mentor.rodaTransacaoFromObjeto(
          2009,
          'objArquivoBeneficio',
          arquivo,
          true
        );

      obj.situacao = 8;
      checaBeneficio.situacao = 8;
      obj.arquivos = [imagem['ArquivoBeneficio']];

      Mentor.rodaTransacaoFromObjeto(
        2008,
        'objEntregaBeneficioDiverso',
        obj,
        true
      );

      if (!blobFoto) {
        this.loadingService.dismiss();
        const alerta =
          await this.alertController.create({
            header: 'Foto da Entrega',
            message: 'Realizar foto da entrega',
            buttons: [
              {
                text: 'OK',
                handler: async () => {
                  await this.salvarFoto(
                    imagem['ArquivoBeneficio'].codigo
                  );
                },
              },
            ],
          });

        await alerta.present();
        await alerta.onDidDismiss();

      } else {

        await this.uploadFoto(
          imagem['ArquivoBeneficio'].codigo,
          blobFoto
        );

      }
      if (sincroniza) {
        this.toastService.showToast({
          message: `Entrega efetuada com sucesso`,
          cssClass: 'toast-success',
        });
      }
      await this.atualizaOnlineCounter();
    } catch (error) {

      throw new Error(`Erro no código ${codigo}`);

    }

  }

  async carregarEntregasOffline() {

    const entregas =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      )) ?? [];

    if (!entregas.length) return;

    let restantes = [...entregas];

    for (const entrega of entregas) {

      try {

        const blob =
          this.base64ToBlob(entrega.foto);

        await this.validaCodigoOnline(
          entrega.codigo,
          true,
          blob
        );

        restantes = restantes.filter(
          (e) => e.codigo !== entrega.codigo
        );

      } catch (error) {

        console.error(
          'Erro sincronizando',
          entrega
        );

      }

    }

    await this.storageService.setValue(
      StorageKeysEnums.beneficiarioOffline,
      restantes
    );

    this.offlineCounter = restantes.length;
    await this.atualizaOnlineCounter();
  }

  async salvarFoto(codigo: string) {
    try {

      const cameraResults: Photo =
        await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

      const response =
        await fetch(cameraResults.webPath!);

      const blob = await response.blob();

      const status = await Network.getStatus();

      if (!status.connected) {

        const base64 =
          await this.blobToBase64(blob);

        let lista =
          (await this.storageService.getValue<any[]>(
            StorageKeysEnums.beneficiarioOffline
          )) ?? [];

        lista.push({
          codigo,
          foto: base64,
        });

        await this.storageService.setValue(
          StorageKeysEnums.beneficiarioOffline,
          lista
        );

        this.offlineCounter = lista.length;

        return;

      }

      await this.uploadFoto(codigo, blob);

    } catch (error) {

      console.error('Erro salvar foto', error);

    }

  }

  async uploadFoto(codigo: string, blob: Blob) {

    const formData = new FormData();

    formData.append('arquivo', blob);
    formData.append('varCodigo', codigo + '');
    formData.append('extensaoFoto', '.png');

    const req = new XMLHttpRequest();

    req.open(
      'POST',
      Mentor.UrlRequest +
      'jsp/salvarFotoBeneficioDiversoApp.jsp',
      true
    );

    req.send(formData);

  }

  blobToBase64(blob: Blob): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onloadend = () =>
        resolve(reader.result as string);

      reader.onerror = reject;

      reader.readAsDataURL(blob);

    });

  }

  base64ToBlob(base64: string): Blob {

    const arr = base64.split(',');
    const mime =
      arr[0].match(/:(.*?);/)![1];

    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });

  }

  async atualizaOnlineCounter() {

    try {

      const retorno: any = Mentor.bind(
        `varsituacao=8`,
        'jsp/appEntregaBeneficioDiversos/totalDiario.jsp',
        'POST'
      );

      const parsed = JSON.parse(retorno);
      console.log('Total entregas diárias:', parsed.totalEntregasDiarias);
      this.onlineCounter =
        parsed.totalEntregasDiarias;

    } catch (error) {

      console.error(error);

    }

  }

}