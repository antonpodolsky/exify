import { IStorage, ISettings } from '../../types';
import { StorageKey, DefaultSettings } from '../../constants';

export class Storage implements IStorage {
  constructor(private browser: typeof chrome, private url: URL) {}

  public get() {
    return new Promise<ISettings>(resolve =>
      this.browser.storage.local.get([StorageKey], res => {
        const settings =
          (res[StorageKey] as ISettings) || DefaultSettings.get();

        settings.disabledDomains = settings.disabledDomains || [];
        settings.enabled =
          settings.disabledDomains.indexOf(this.url.hostname) === -1;

        resolve(settings);
      })
    );
  }

  public save(newSettings: ISettings) {
    return new Promise<ISettings>(resolve =>
      this.get().then(settings => {
        const { enabled, optionalExifProperties } = newSettings;
        const { disabledDomains } = settings;
        const domainIndex = disabledDomains.indexOf(this.url.hostname);

        if (enabled && domainIndex !== -1) {
          disabledDomains.splice(domainIndex, 1);
        } else if (!enabled && domainIndex === -1) {
          disabledDomains.push(this.url.hostname);
        }

        settings = { optionalExifProperties, disabledDomains };

        this.browser.storage.local.set({ [StorageKey]: settings }, resolve);
      })
    );
  }
}
