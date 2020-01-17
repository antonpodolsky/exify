import { ISettings, IStorage } from '../types';
import { OptionalExifProperties } from '../config';

export const getDefaultSettings = (): ISettings => ({
  optionalExifProperties: [],
  siteFilterType: 'blacklist',
  overlayToggleType: 'imageHover',
  overlaySize: 'default',
  disabledDomains: [],
  enabledDomains: [],
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
    settings.enabledDomains = settings.enabledDomains || [];
    settings.enabled =
      settings.siteFilterType === 'blacklist'
        ? settings.disabledDomains.indexOf(this.url.hostname) === -1
        : settings.enabledDomains.indexOf(this.url.hostname) !== -1;

    settings.optionalExifProperties = settings.optionalExifProperties.filter(
      name => !!OptionalExifProperties[name]
    );

    return settings;
  }

  public async save(newSettings: ISettings) {
    let settings = await this.get();

    const {
      enabled,
      optionalExifProperties,
      siteFilterType,
      overlayToggleType,
      overlaySize,
    } = newSettings;

    const { disabledDomains, enabledDomains } = settings;

    if (siteFilterType === 'blacklist') {
      const domainIndex = disabledDomains.indexOf(this.url.hostname);

      if (enabled && domainIndex !== -1) {
        disabledDomains.splice(domainIndex, 1);
      } else if (!enabled && domainIndex === -1) {
        disabledDomains.push(this.url.hostname);
      }
    } else {
      const domainIndex = enabledDomains.indexOf(this.url.hostname);

      if (!enabled && domainIndex !== -1) {
        enabledDomains.splice(domainIndex, 1);
      } else if (enabled && domainIndex === -1) {
        enabledDomains.push(this.url.hostname);
      }
    }

    settings = {
      optionalExifProperties,
      disabledDomains,
      enabledDomains,
      siteFilterType,
      overlayToggleType,
      overlaySize,
    };

    this.storage.save(settings);

    return settings;
  }
}
