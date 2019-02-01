import { readExif } from './lib/exif-reader';
import { Exify } from './exify';
import { IStorage, ISettings } from './types';
import { StorageKey, DefaultSettings } from './constants';

import 'dialog-polyfill/dialog-polyfill.css';
import './components/exify.scss';
import './components/exif/exif.scss';
import './components/overlay/overlay.scss';
import './components/settings/settings.scss';
import './components/switch/switch.scss';

class Storage implements IStorage {
  constructor(private localStorage) {}

  public get() {
    let settings: ISettings;

    try {
      settings = JSON.parse(this.localStorage.getItem(StorageKey));
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }

    settings = settings || DefaultSettings.get();
    settings.disabledDomains = settings.disabledDomains || [];
    settings.enabled =
      settings.disabledDomains.indexOf(document.location.hostname) === -1;

    return Promise.resolve(settings);
  }

  public save(settings: ISettings) {
    this.localStorage.setItem(StorageKey, JSON.stringify(settings));

    return Promise.resolve(settings);
  }
}

new Exify(document).init(readExif, new Storage(localStorage));
