export const StorageKey = 'exifysettings';
export const OverlayHeight = 60;
export const MinLongSideLength = 600;
export const RequestTimeout = 4500;

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
  _Location = 'Location',
  Software = 'Software',
}

export const ExifProperties = {
  ...DefaultExifProperties,
  ...OptionalExifProperties,
};

export type ExifProperties = DefaultExifProperties | OptionalExifProperties;
