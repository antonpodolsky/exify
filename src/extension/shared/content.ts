import { readExif } from '../../lib/exif-reader';
import { Exify } from '../../exify';
import { IStorage, IUserSettings } from '../../types';
import { StorageKey } from '../../constants';

class Storage implements IStorage {
  constructor(private browser: typeof chrome) {}

  public getUserSettings() {
    return new Promise<IUserSettings>(resolve =>
      this.browser.storage.local.get([StorageKey], res =>
        resolve(
          (res[StorageKey] as IUserSettings) || { optionalExifProperties: [] }
        )
      )
    );
  }

  public saveUserSettings(userSettings: IUserSettings) {
    return new Promise<IUserSettings>(resolve =>
      this.browser.storage.local.set({ [StorageKey]: userSettings }, resolve)
    );
  }
}

export const init = (browser: typeof chrome) =>
  new Exify(document).init(readExif, new Storage(browser));
