import { Injectable } from '@angular/core';

import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
  GoogleBarcodeScannerModuleInstallState,
  ScanErrorEvent,
} from '@capacitor-mlkit/barcode-scanning';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  constructor(private readonly toastService: ToastService) {}

  async checkPermission() {
    const isAllowed = await BarcodeScanner.checkPermissions();

    if (isAllowed.camera === 'prompt') {
      const requestPermission = await BarcodeScanner.requestPermissions();

      return requestPermission.camera === 'granted';
    }

    return isAllowed.camera === 'granted' || isAllowed.camera === 'limited';
  }

  async shouldSupportCamera() {
    const isSupported = await BarcodeScanner.isSupported();

    return isSupported.supported;
  }

  async stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }

  async startScan(): Promise<string> {
    try {
      const hasPermission = await this.checkPermission();

      if (!hasPermission) {
        await this.toastService.showToast({
          message:
            'Você precisa permitir que o aplicativo use a câmera para prosseguir com a leitura',
        });

        return;
      }

      document.querySelector('body')?.classList.add('barcode-scanning-active');

      const barcodeResult = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode]
      });

      await this.stopScan();

      return barcodeResult.barcodes?.map((b) => b.displayValue).join('');
    } catch (error) {
      this.stopScan();

      throw error;
    }
  }

  async baixaGoogleScannerModule() {
    const isGoogleBarcodeModuleInstalled =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

    if (!isGoogleBarcodeModuleInstalled.available) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();

      await new Promise<void>((resolve) => {
        BarcodeScanner.addListener(
          'googleBarcodeScannerModuleInstallProgress',
          (event) => {
            if (
              event.state === GoogleBarcodeScannerModuleInstallState.COMPLETED
            ) {
              resolve();
            }
          }
        );
      });
    }
  }
}
