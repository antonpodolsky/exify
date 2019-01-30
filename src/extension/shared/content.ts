import { readExif } from '../../lib/exif-reader';
import { Exify } from '../../exify';
import { IStorage, IUserSettings } from '../../types';
import { StorageKey, DefaultUserSettings } from '../../constants';

class Storage implements IStorage {
  constructor(private browser: typeof chrome) {}

  public getUserSettings() {
    return new Promise<IUserSettings>(resolve =>
      this.browser.storage.local.get([StorageKey], res => {
        const userSettings = (res[StorageKey] as IUserSettings) || {
          ...DefaultUserSettings,
        };

        userSettings.disabledDomains = userSettings.disabledDomains || [];

        resolve(userSettings);
      })
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
