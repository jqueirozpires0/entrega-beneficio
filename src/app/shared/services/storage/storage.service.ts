import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StorageKeysEnums } from 'src/app/enums/StorageKeys.enums';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  async setValue(key: StorageKeysEnums, objectValue: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(objectValue),
    });
  }
  async getValue<T>(key: StorageKeysEnums): Promise<T> {
    const storedValue = await Preferences.get({ key });
    const parsedObjectValue = JSON.parse(storedValue?.value);
    return parsedObjectValue;
  }
  async remove(): Promise<void> {
    await Preferences.clear()
  }
}
