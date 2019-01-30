import { readExif } from './lib/exif-reader';
import { Exify } from './exify';
import { IStorage, IUserSettings } from './types';
import { StorageKey, DefaultUserSettings } from './constants';

import 'dialog-polyfill/dialog-polyfill.css';
import './components/exify.scss';
import './components/exif/exif.scss';
import './components/overlay/overlay.scss';
import './components/settings/settings.scss';

class Storage implements IStorage {
  constructor(private localStorage) {}

  public getUserSettings() {
    let userSettings: IUserSettings;

    try {
      userSettings = JSON.parse(this.localStorage.getItem(StorageKey));
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }

    userSettings = userSettings || { ...DefaultUserSettings };
    userSettings.disabledDomains = userSettings.disabledDomains || [];

    return Promise.resolve(userSettings);
  }

  public saveUserSettings(userSettings: IUserSettings) {
    this.localStorage.setItem(StorageKey, JSON.stringify(userSettings));

    return Promise.resolve(userSettings);
  }
}

new Exify(document).init(readExif, new Storage(localStorage));
