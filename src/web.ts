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
  constructor(private localStorage, private url: URL) {}

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
      settings.disabledDomains.indexOf(this.url.hostname) === -1;

    return Promise.resolve(settings);
  }

  public save(newSettings: ISettings) {
    return this.get().then(settings => {
      const { enabled, optionalExifProperties } = newSettings;
      const { disabledDomains } = settings;
      const domainIndex = disabledDomains.indexOf(this.url.hostname);

      if (enabled && domainIndex !== -1) {
        disabledDomains.splice(domainIndex, 1);
      } else if (!enabled && domainIndex === -1) {
        disabledDomains.push(this.url.hostname);
      }

      settings = { optionalExifProperties, disabledDomains };

      this.localStorage.setItem(StorageKey, JSON.stringify(settings));

      return settings;
    });
  }
}

new Exify(document).init(
  readExif,
  new Storage(localStorage, document.location as any)
);
