export interface IExifyImage extends HTMLImageElement {
  exifdata?: object;
}

export interface IExifData {
  [key: string]: IExifDataProp;
}

export interface IExifDataProp {
  value: any;
  name?: string;
  title?: string;
  selected?: boolean;
  isHtml?: boolean;
}

export interface IStorage<T> {
  get: () => Promise<T>;
  save: (obj: T) => Promise<T>;
}

export interface ISettings {
  optionalExifProperties: string[];
  siteFilterType: 'whitelist' | 'blacklist';
  overlayToggleType: 'imageHover' | 'logoHover';
  overlaySize: 'default' | 'compact';
  disabledDomains?: string[];
  enabled?: boolean;
  url?: string;
}
