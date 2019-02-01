import { readExif } from '../../lib/exif-reader';
import { Exify } from '../../exify';
import { IStorage, ISettings } from '../../types';
import { StorageKey, DefaultSettings } from '../../constants';

class Storage implements IStorage {
  constructor(private browser: typeof chrome) {}

  public get() {
    return new Promise<ISettings>(resolve =>
      this.browser.storage.local.get([StorageKey], res => {
        const settings =
          (res[StorageKey] as ISettings) || DefaultSettings.get();

        settings.disabledDomains = settings.disabledDomains || [];
        settings.enabled =
          settings.disabledDomains.indexOf(document.location.hostname) === -1;

        resolve(settings);
      })
    );
  }

  public save(settings: ISettings) {
    return new Promise<ISettings>(resolve =>
      this.browser.storage.local.set({ [StorageKey]: settings }, resolve)
    );
  }
}

export const init = (browser: typeof chrome) =>
  new Exify(document).init(readExif, new Storage(browser));
