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
      this.listaBeneficiarios = Mentor.executaVisao(3453, 'varcodigoBeneficio=1235');
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
    await this.checkCameraSupport();
    this.loadingService.dismiss();
  }

  async atualizarTela(event: any) {
    this.ionViewDidEnter();
    event.target.complete();
  }

  logout() {
    this.storageService.setValue(StorageKeysEnums.usuarioLogado, []);
    this.navCtrl.navigateRoot('seleciona-municipio');
  }

  abrirModalCpf() {
    this.cpfInput = '';
    this.modalEntregaCpf = true;
  }

  abrirModalNomeCpf() {
    this.cpfInput = '';
    this.nomeInput = '';
    this.bairro = null;
    this.modalEntregaCpf = false;
    this.modalEntregaNomeCpf = true;
  }

  fecharModalCpf() {
    this.modalEntregaCpf = false;
  }

  fecharModalNomeCpf() {
    this.modalEntregaNomeCpf = false;
    this.nomeInput = '';
    this.cpfInput = '';
    this.bairro = null;
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

  async entregarPorNomeCpf() {
    var bol = this.validarCPF(this.cpfInput);

    if (!bol) {
      this.toastService.showToast({ message: 'CPF Inválido.' });
      return;
    }
    if (!this.nomeInput || !this.cpfInput) {
      this.toastService.showToast({ message: 'Preencha nome e CPF.' });
      return;
    }
    try {
      await this.loadingService.present();
      const status = await Network.getStatus();

      if (!status.connected) {
        this.loadingService.dismiss();
        await this.armazenarBeneficiariosLocalmente(this.nomeInput, this.cpfInput, this.bairro);
        return;
      }
      await this.novaEntregaPorNomeCpf(this.nomeInput, this.cpfInput, null, this.bairro);
      this.toastService.showToast({ message: 'Entrega efetuada com sucesso', cssClass: 'toast-success' });
      this.modalEntregaNomeCpf = false;
      this.nomeInput = '';
      this.cpfInput = '';
      await this.atualizaOnlineCounter();
      await this.atualizarOfflineCounter();
    } catch (error) {
      this.toastService.showToast({ message: 'Erro ao entregar benefício', cssClass: 'toast-error' });
    } finally {
      await this.loadingService.dismiss();
    }
  }

  async novaEntregaPorNomeCpf(nome: string, cpf: string, base64?: string, bairro?: number) {
    const obj: BeneficiosDiversos = new BeneficiosDiversos(null);
    obj.codigo = 0;
    obj.situacao = 8;
    obj.cpf = cpf;
    obj.bairro_novo.codigo = bairro
    obj.nome = nome;
    obj.tipoBeneficio.codigo = 1235;
    obj.dataEntrega = new Date();
    obj.entregador = new Funcionarios(this.usuarioLogado)
    const arquivoEnvio = {
      descricao: 'Foto da Entrega',
      flagUpoload: 1,
      extensao: '.png',
    };

    const arquivo = new ArquivoBeneficio(arquivoEnvio);

    const imagem =
      Mentor.rodaTransacaoFromObjeto(
        2009,
        'objArquivoBeneficio',
        arquivo,
        true
      );

    obj.arquivos = [imagem['ArquivoBeneficio']];

    this.listaBeneficiarios.push({
      nome,
      cpf,
      situacao: 8
    });
    console.log('1-1', obj)
    Mentor.rodaTransacaoFromObjeto(
      2008,
      'objEntregaBeneficioDiverso',
      obj,
      true
    );

    await this.loadingService.dismiss();

    if (!base64 || base64 == '' || base64 == null) {
      const alerta =
        await this.alertController.create({
          header: 'Foto da Entrega',
          message: 'Realizar foto da entrega',
          backdropDismiss: false,
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
    }

    if (base64) {
      let blob: Blob;
      blob = this.base64ToBlob(base64);
      await this.uploadFoto(imagem['ArquivoBeneficio'].codigo, blob)
    }


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

      await this.loadingService.dismiss();

    }

    const scannedCode =
      await this.scannerService.startScan();

    if (!scannedCode) return;

    await this.validaCodigo(scannedCode);

  }

  async validaCpf() {
    console.log(this.cpfInput, '1')
    if (!this.cpfInput) {

      this.toastService.showToast({
        message: `Sem CPF`,
      });

      return;

    }
    var bol = this.validarCPF(this.cpfInput);

    if (!bol) {
      this.toastService.showToast({ message: 'CPF Inválido.' });
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
      await this.loadingService.dismiss();
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

      console.log('1',checaBeneficio)

      if (checaBeneficio?.situacao === 8) {

        this.toastService.showToast({
          message: `Usuário ${checaBeneficio.nome} já recebeu o benefício`,
        });

        return;

      }
      console.log('2',checaBeneficio)
      
      if (!checaBeneficio) {
        await this.loadingService.dismiss();
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
      checaBeneficio.entregador = new Funcionarios(this.usuarioLogado)
      const status = await Network.getStatus();

      if (!status.connected) {
        
        await this.salvarFoto(codigo);
        checaBeneficio.situacao = 8;
        this.toastService.showToast({
          message: `Entrega salva offline`,
          cssClass: 'toast-success',
        });
        return;

      }

      const obj: BeneficiosDiversos =
        new BeneficiosDiversos(checaBeneficio);
      console.log('obj1',obj)
      obj.dataEntrega = new Date();
      const arquivoEnvio = {
        descricao: 'Foto da Entrega',
        flagUpoload: 1,
        extensao: '.png',
      };

      const arquivo = new ArquivoBeneficio(arquivoEnvio);

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

        try {
          await this.loadingService.dismiss();
        } catch { }

        const alerta =
          await this.alertController.create({
            header: 'Foto da Entrega',
            message: 'Realizar foto da entrega',
            backdropDismiss: false,
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
      this.fecharModalCpf();
      await this.atualizaOnlineCounter();
      await this.atualizarOfflineCounter();

    } catch (error) {

      console.error('Erro ao validar código:', {
        codigo,
        erro: error
      });

      this.toastService.showToast({
        message: `Erro ao processar código ${codigo}`,
        cssClass: 'toast-error'
      });

    }

  }

  async carregarEntregasOffline() {
    await this.criarNovosBeneficiariosLocalmente();
    const entregas =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      )) ?? [];

    if (!entregas.length) return;

    let restantes = [...entregas];

    for (const entrega of entregas) {
      try {

        let blob: Blob;
        if (entrega.foto instanceof Blob) {

          blob = entrega.foto;

        } else {

          blob = this.base64ToBlob(entrega.foto);

        }
        await this.validaCodigoOnline(
          entrega.codigo,
          true,
          blob
        );
        restantes = restantes.filter(
          (e) => e.codigo !== entrega.codigo
        );

      } catch (error) {

        await this.toastService.showToast({
          message: 'Erro na sincronização',
          cssClass: 'toast-error'
        })

      }

    }
    await this.toastService.showToast({ message: 'Entregas sincronizadas', cssClass: 'toast-success' })
    await this.storageService.setValue(
      StorageKeysEnums.beneficiarioOffline,
      restantes
    );
    this.offlineCounter = restantes.length;
    await this.atualizaOnlineCounter();
    await this.atualizarOfflineCounter();
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
      if (error?.message?.includes('User cancelled')) {

        this.toastService.showToast({
          message: 'A foto é obrigatória. Tente novamente.',
          cssClass: 'toast-error'
        });

        return this.salvarFoto(codigo);
      }

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

    const byteCharacters = atob(base64.split(',')[1]);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: 'image/png' });

  }

  async atualizarOfflineCounter() {
    const entregas =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.beneficiarioOffline
      )) ?? [];

    const novos =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.novosBeneficiariosOffline
      )) ?? [];

    this.offlineCounter = entregas.length + novos.length;
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

  async armazenarBeneficiariosLocalmente(nome: string, cpf: string, bairro: number) {
    var bol = this.validarCPF(this.cpfInput);

    if (!bol) {
      this.toastService.showToast({ message: 'CPF Inválido.' });
      return;
    }
    const alerta =
      await this.alertController.create({
        header: 'Foto da Entrega',
        message: 'Realizar foto da entrega',
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: async () => {
            },
          },
        ],
      });

    await alerta.present();
    await alerta.onDidDismiss();

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

    const base64 =
      await this.blobToBase64(blob);

    const novosBeneficiarios = {
      nome,
      cpf,
      foto: base64,
      bairro: bairro,
      responsavelAlteracao: this.responsavelLeitura.codigo
    };

    this.beneficiarios.push(novosBeneficiarios);
    await this.storageService.setValue(
      StorageKeysEnums.novosBeneficiariosOffline,
      this.beneficiarios
    );
    await this.toastService.showToast({
      message: 'Beneficiário armazenado localmente',
      cssClass: 'toast-success'
    });
    this.fecharModalNomeCpf();
  }

  async criarNovosBeneficiariosLocalmente() {
    const lista =
      (await this.storageService.getValue<any[]>(
        StorageKeysEnums.novosBeneficiariosOffline
      )) ?? [];

    if (!lista.length) return;

    let restantes = [...lista];

    for (const beneficiario of lista) {
      try {
        await this.novaEntregaPorNomeCpf(
          beneficiario.nome,
          beneficiario.cpf,
          beneficiario.foto,
          beneficiario.bairro
        );

        restantes = restantes.filter(
          (b) =>
            b.cpf !== beneficiario.cpf ||
            b.nome !== beneficiario.nome
        );

      } catch (error) {
        console.error('Erro ao sincronizar beneficiário:', beneficiario, error);
      }
    }

    await this.toastService.showToast({
      message: 'Novos benefícios sincronizados na plataforma',
      cssClass: 'toast-success'
    })

    await this.storageService.setValue(
      StorageKeysEnums.novosBeneficiariosOffline,
      restantes
    );

    await this.atualizarOfflineCounter();
  }
}