import { ISettings, IStorage } from '../types';
import { reduce } from '../utils';
import { OptionalExifProperties } from '../config';

export const getDefaultSettings = (): ISettings => ({
  optionalExifProperties: [],
  disabledDomains: [],
  enabled: true,
});

export class SettingsStorage {
  constructor(private storage: IStorage<ISettings>, private url: URL) {}

  public async get() {
    let settings = await this.storage.get();

    settings = {
      ...getDefaultSettings(),
      ...settings,
      url: this.url.hostname,
    };
    settings.disabledDomains = settings.disabledDomains || [];
    settings.enabled =
      settings.disabledDomains.indexOf(this.url.hostname) === -1;

    settings.optionalExifProperties = settings.optionalExifProperties.filter(
      name => !!OptionalExifProperties[name]
    );

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
