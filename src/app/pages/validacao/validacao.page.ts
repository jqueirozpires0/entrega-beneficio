import { Component, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Mentor } from 'src/app/models/Mentor';
import { ArquivoBeneficio, Bairro, BeneficiosDiversos, Funcionarios } from 'src/app/models/Modelo';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ScannerService } from 'src/app/shared/services/scanner/scanner.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { StorageKeysEnums } from 'src/app/enums/StorageKeys.enums';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.page.html',
  styleUrls: ['./validacao.page.scss'],
})
export class ValidacaoPage implements OnDestroy {

  isCameraSupported = true;
  nomeInput: string = '';
  responsavelLeitura: any = null;
  usuarioLogado: Funcionarios = null;
  cpfInput: string = '';
  onlineCounter = 0;
  offlineCounter = 0;
  bairro = 0;
  status = null;
  listaBeneficiarios: any[] = [];
  listaBairros: any[] = [];
  beneficiarios: any[] = [];
  modalEntregaCpf = false;
  modalEntregaNomeCpf = false;

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

  ngOnDestroy(): void {
    this.scannerService.stopScan();
  }

  async ionViewDidEnter() {
    await this.loadingService.present()
    const user = await this.storageService.getValue<any>(StorageKeysEnums.usuarioLogado);
    this.usuarioLogado = user
    this.responsavelLeitura = user.codigo;
    const status = await Network.getStatus();
    if (status.connected === true) {
      this.listaBeneficiarios = Mentor.executaVisao(3453, 'varcodigoBeneficio=1321');
      console.log('Beneficiarios online', this.listaBeneficiarios);
      this.listaBairros = Mentor.executaVisao(424, '');
    } else {
      this.listaBairros = (await this.storageService.getValue<any[]>(
        StorageKeysEnums.listaBairros
      )) ?? [];
      this.listaBeneficiarios = (await this.storageService.getValue<any[]>(
        StorageKeysEnums.listaPessoas
      )) ?? [];
    }
    const entregas =
      await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      );
    this.status = status.connected;

    this.offlineCounter = entregas?.length ?? 0;

    await this.atualizaOnlineCounter();
    await this.atualizarOfflineCounter();
    //await this.checkCameraSupport();
    this.loadingService.dismiss();
  }

  async atualizarTela(event: any) {
    this.ionViewDidEnter();
    event.target.complete();
  }

  logout() {
    this.storageService.setValue(StorageKeysEnums.usuarioLogado, []);
    this.navCtrl.navigateRoot('login');
  }

  abrirModalCpf() {
    this.cpfInput = '';
    this.modalEntregaCpf = true;
  }

  abrirModalNomeCpf() {
    this.cpfInput = '';
    this.nomeInput = '';
    this.bairro = 0;
    this.modalEntregaCpf = false;
    this.modalEntregaNomeCpf = true;
  }

  fecharModalCpf() {
    this.modalEntregaCpf = false;
    this.loadingService.dismiss();
    this.ionViewDidEnter();
  }

  fecharModalNomeCpf() {
    this.modalEntregaNomeCpf = false;
    this.nomeInput = '';
    this.cpfInput = '';
    this.bairro = 0;
    this.loadingService.dismiss();
    this.ionViewDidEnter();
  }

  validarCPF(cpf: string): boolean {
    console.log(cpf, '3')
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += Number(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== Number(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += Number(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== Number(cpf.charAt(10))) return false;

    return true;
  }

  // ------------------------------- SCANNER -------------------------------

  async checkCameraSupport() {
    this.isCameraSupported =
      await this.scannerService.shouldSupportCamera();
  }

  async startScan() {
    try {
      await this.loadingService.present();
      await this.scannerService.baixaGoogleScannerModule();
    } finally {
      await this.loadingService.dismiss();
    }
    const scannedCode =
      await this.scannerService.startScan();

    if (!scannedCode) return;
    const valido = this.validarCPF(scannedCode);
    if (!valido) {
      this.toastService.showToast({
        message: 'CPF inválido. Tente novamente.',
        cssClass: 'toast-error'
      });
      return this.startScan();
    } else {
      this.realizarEntrega(scannedCode);
    }
  }

  // ------------------------------- ENTREGA BENEFÍCIO -------------------------------
  async realizarEntrega(cpf: string) {
    try {
      const beneficiario = this.listaBeneficiarios.find(
        (b) => b.cpf === cpf
      );
      if (beneficiario?.situacao === 8) {
        this.toastService.showToast({
          message: `Usuário ${beneficiario.nome} já recebeu o benefício`,
        });
        return;
      }
      if (!beneficiario) {
        const alerta =
          await this.alertController.create({
            header: 'Usuário não listado',
            message: 'Usuário não está na lista de beneficiários, deseja realizar a entrega mesmo assim?',
            backdropDismiss: false,
            buttons: [
              {
                text: 'OK',
                handler: async () => {
                  this.fecharModalCpf();
                  this.abrirModalNomeCpf();
                },
              },
              {
                text: 'Cancelar',
                role: 'cancel',
              },
            ],
          });
        await alerta.present();
        await alerta.onDidDismiss();
        return;
      }
      const status = await Network.getStatus();

      if (status.connected && beneficiario) {
        this.entregaComBeneficiarioInternet(beneficiario);
      }
      else if (beneficiario && !status.connected) {
        this.entregaComBeneficiarioOffline(beneficiario);
      }
      await this.atualizaOnlineCounter();
      await this.atualizarOfflineCounter();
      this.status = status.connected;
    } catch (error) {
      console.log("AQUI 1")
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async realizarEntregaNova(cpf: string) {
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        this.entregaSemBeneficiarioInternet(cpf);
      } else {
        this.entregaSemBeneficiarioOffline(cpf);
      }
    } catch (error) {
      console.log("AQUI 2");
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async entregaComBeneficiarioInternet(beneficiario: any) {
    try {
      const obj: BeneficiosDiversos = new BeneficiosDiversos(beneficiario);
      obj.entregador = new Funcionarios(this.usuarioLogado)
      obj.situacao = 8;
      obj.dataEntrega = new Date();
      const foto = await this.tirarFoto(obj);
      if (foto) {
        this.toastService.showToast({
          message: `Benefício entregue com sucesso para ${beneficiario.nome}!`,
          cssClass: 'toast-success'
        });
        await this.atualizaOnlineCounter();
        this.fecharModalCpf();
      } else {
        console.log("1");
        // this.toastService.showToast({
        //   message: 'Erro ao realizar entrega. Tente novamente.',
        //   cssClass: 'toast-error'
        // });
      }
    } catch (error) {
      console.log("AQUI 3")
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async entregaSemBeneficiarioInternet(cpf: string) {
    try {
      if (this.bairro === 0 || this.cpfInput === "" || this.nomeInput === "") {
        this.toastService.showToast({
          message: 'Todos os campos são obrigatórios.',
          cssClass: 'toast-error'
        });
        return;
      } else {
        const obj: BeneficiosDiversos = new BeneficiosDiversos(null);
        obj.codigo = 0;
        obj.cpf = cpf;
        obj.tipoBeneficio.codigo = 1321;
        obj.nome = this.nomeInput;
        obj.bairro_novo.codigo = this.bairro;
        obj.dataEntrega = new Date();
        obj.entregador = new Funcionarios(this.usuarioLogado);
        obj.situacao = 8;
        const foto = await this.tirarFoto(obj);
        if (foto) {
          this.toastService.showToast({
            message: `Benefício entregue com sucesso para ${obj.nome}!`,
            cssClass: 'toast-success'
          });
          await this.atualizaOnlineCounter();
          this.fecharModalNomeCpf();
        } else {
          console.log("2");
          // this.toastService.showToast({
          //   message: 'Erro ao realizar entrega. Tente novamente.',
          //   cssClass: 'toast-error'
          // });
        }
      }
    } catch (error) {
      console.log("AQUI 3")
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async entregaSemBeneficiarioOffline(cpf: string) {
    try {
      if (this.bairro === 0 || this.cpfInput === "" || this.nomeInput === "") {
        this.toastService.showToast({
          message: 'Todos os campos são obrigatórios.',
          cssClass: 'toast-error'
        });
        return;
      } else {
        const obj: BeneficiosDiversos = new BeneficiosDiversos(null);
        obj.codigo = 0;
        obj.cpf = cpf;
        obj.tipoBeneficio.codigo = 1321;
        obj.nome = this.nomeInput;
        obj.bairro_novo.codigo = this.bairro;
        obj.dataEntrega = new Date();
        obj.entregador = new Funcionarios(this.usuarioLogado);
        obj.situacao = 8;
        const foto = await this.tirarFoto(obj);
        if (!foto) {
          this.toastService.showToast({
            message: 'Erro ao tirar foto. Tente novamente.',
            cssClass: 'toast-error'
          });
          return;
        }
        if (typeof foto !== 'string') {
          return;
        } else {
          obj.arquivos[0].descricao = foto;
          this.storageService.setValueList(StorageKeysEnums.beneficiarioOffline, obj);
          this.fecharModalNomeCpf();
          this.toastService.showToast({
            message: `Benefício para ${this.nomeInput} salvo offline. Será enviado quando houver conexão com a internet.`,
            cssClass: 'toast-success'
          });
        }
      }
    } catch (error) {
      console.log("AQUI 4")
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async entregaComBeneficiarioOffline(beneficiario: any) {
    try {
      const obj: BeneficiosDiversos = new BeneficiosDiversos(beneficiario);
      console.log("1");
      obj.entregador = new Funcionarios(this.usuarioLogado)
      console.log("2");
      console.log("3");
      obj.dataEntrega = new Date();
      console.log("4");
      obj.situacao = 8;
      console.log("5");
      const foto = await this.tirarFoto(obj);
      console.log("6");
      if (typeof foto !== 'string') {
        console.log("7");
        return;
      } else {
        console.log("8");
        obj.arquivos[0].descricao = foto;
        this.storageService.setValueList(StorageKeysEnums.beneficiarioOffline, obj);
        this.toastService.showToast({
          message: `Benefício para ${this.nomeInput} salvo offline. Será enviado quando houver conexão com a internet.`,
          cssClass: 'toast-success'
        });
      }
      this.fecharModalCpf();
    } catch (error) {
      console.log("AQUI 5")
      console.log(error);
      console.log(error.mensagem);
      // this.toastService.showToast({
      //   message: 'Erro ao realizar entrega. Tente novamente.',
      //   cssClass: 'toast-error'
      // });
    }
  }

  async atualizarBeneficiariosOffline() {
    console.log('Iniciando atualização de beneficiários offline');
    const beneficiariosOffline =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      )) ?? [];

    for (const beneficiario of beneficiariosOffline) {
      if (!beneficiario.arquivos[0]) continue;
      const blob = this.base64ToBlob(beneficiario.arquivos[0].descricao);
      beneficiario.arquivos = [];
      const imagem = await this.uploadFoto(beneficiario, blob);
      console.log(imagem)
      if (imagem) {
        this.toastService.showToast({
          message: `Benefício entregue com sucesso para ${beneficiario.nome}!`,
          cssClass: 'toast-success'
        });
        await this.atualizaOnlineCounter();
      } else {
        console.log("3");
        // this.toastService.showToast({
        //   message: `Erro ao realizar entrega para ${beneficiario.nome}. Tente novamente.`,
        //   cssClass: 'toast-error'
        // });
      }
    }
    await this.storageService.setValue(
      StorageKeysEnums.beneficiarioOffline, []
    );
    await this.atualizarOfflineCounter();
  }
  // ------------------------------- CONTADORES -------------------------------

  async atualizarOfflineCounter() {
    const entregas =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      )) ?? [];

    this.offlineCounter = entregas.length;
  }

  async atualizaOnlineCounter() {

    try {

      const retorno: any = Mentor.bind(
        `varsituacao=8`,
        'jsp/appEntregaBeneficioDiversos/totalDiario.jsp',
        'POST'
      );

      const parsed = JSON.parse(retorno);

      this.onlineCounter =
        parsed.totalEntregasDiarias;

    } catch (error) {

      console.error(error);

    }

  }

  // ------------------------------- FOTOS -------------------------------

  async tirarFoto(beneficiario: any): Promise<any> {
    const alert = await this.alertController.create({
      header: 'Tirar Foto',
      message: 'É necessário tirar uma foto para realizar a entrega. Deseja tirar a foto agora?',
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        }
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
    try {
      const cameraResults: Photo =
        await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

      const response = await fetch(cameraResults.webPath!);
      const blob = await response.blob();

      const networkStatus = await Network.getStatus();
      if (networkStatus.connected === true) {
        const fotoUpload = await this.uploadFoto(beneficiario, blob);
        if (fotoUpload === false) {
          this.toastService.showToast({
            message: 'Erro ao salvar foto. Tente novamente.',
            cssClass: 'toast-error'
          });
          return this.tirarFoto(beneficiario);
        }
        return true;
      } else {
        return await this.blobToBase64(blob);;
      }
    } catch (error) {
      if (error?.message?.includes('User cancelled')) {
        this.toastService.showToast({
          message: 'A foto é obrigatória. Tente novamente.',
          cssClass: 'toast-error'
        });
        return this.tirarFoto(beneficiario);
      }
      console.error('Erro salvar foto', error);
    }
  }

  async uploadFoto(beneficiario: any, blob: Blob): Promise<any> {
    await this.loadingService.present();
    try {
      console.log("BENEFICIARIO AQUI");
      console.log(beneficiario);
      const imagem =
        await Mentor.rodaTransacaoFromObjeto(
          2008,
          'objEntregaBeneficioDiverso',
          beneficiario,
          true,
        );
      if (!imagem) {
        this.toastService.showToast({
          message: 'Erro ao salvar foto. Tente novamente.',
          cssClass: 'toast-error'
        });
        return false;
      } else {
        const codigo = imagem['BeneficiosDiversos'].arquivos[0].codigo;
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
      this.loadingService.dismiss()
      return true;
    } catch (error) {
      this.loadingService.dismiss()
      return false;
    }
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

    const byteCharacters = atob(base64.split(',')[1]);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: 'image/png' });

  }
}