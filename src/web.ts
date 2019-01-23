import { readExif } from './lib/exif-reader';
import { Exify } from './exify';
import { IStorage, IUserSettings } from './types';
import { StorageKey } from './constants';

import 'dialog-polyfill/dialog-polyfill.css';
import './components/exify.scss';
import './components/exif/exif.scss';
import './components/overlay/overlay.scss';
import './components/settings/settings.scss';

class Storage implements IStorage {
  constructor(private localStorage) {}

  public getUserSettings() {
    try {
      return Promise.resolve(
        JSON.parse(this.localStorage.getItem(StorageKey)) || {
          optionalExifProperties: [],
        }
      );
    } catch (e) {
      return Promise.resolve({ optionalExifProperties: [] });
    }
  }

  public saveUserSettings(userSettings: IUserSettings) {
    this.localStorage.setItem(StorageKey, JSON.stringify(userSettings));

    return Promise.resolve(userSettings);
  }
}

new Exify(document).init(readExif, new Storage(localStorage));
