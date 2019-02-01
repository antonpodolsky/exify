export interface IKeyValue<V = any> {
  [key: string]: V;
}

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
}

export interface IStorage {
  get: () => Promise<ISettings>;
  save: (settings: ISettings) => Promise<ISettings>;
}

export interface ISettings {
  optionalExifProperties: Array<OptionalExifProperties[0]>;
  disabledDomains?: string[];
  enabled?: boolean;
}

export enum DefaultExifProperties {
  Model = 'Camera',
  FocalLength = 'Focal length',
  FNumber = 'Aperture',
  ExposureTime = 'Exposure',
  ISOSpeedRatings = 'ISO',
}

export enum OptionalExifProperties {
  MeteringMode = 'Metering mode',
  ExposureProgram = 'Exposure mode',
  ExposureBias = 'Exposure bias',
  DateTimeOriginal = 'Date taken',
  Software = 'Software',
}

export const ExifProperties = {
  ...DefaultExifProperties,
  ...OptionalExifProperties,
};

export type ExifProperties = DefaultExifProperties | OptionalExifProperties;
