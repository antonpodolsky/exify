import { DefaultSettings } from '../constants';
import { ISettings, IStorage } from '../types';

export class SettingsStorage {
  constructor(private storage: IStorage<ISettings>, private url: URL) {}

  public async get() {
    let settings = await this.storage.get();

    settings = {
      ...DefaultSettings.get(),
      ...settings,
      url: this.url.hostname,
    };
    settings.disabledDomains = settings.disabledDomains || [];
    settings.enabled =
      settings.disabledDomains.indexOf(this.url.hostname) === -1;

    return settings;
  }

  public async save(newSettings) {
    let settings = await this.get();

    const { enabled, optionalExifProperties } = newSettings;
    const { disabledDomains } = settings;
    const domainIndex = disabledDomains.indexOf(this.url.hostname);

    if (enabled && domainIndex !== -1) {
      disabledDomains.splice(domainIndex, 1);
    } else if (!enabled && domainIndex === -1) {
      disabledDomains.push(this.url.hostname);
    }

    settings = { optionalExifProperties, disabledDomains };

    this.storage.save(settings);

    return settings;
  }
}
