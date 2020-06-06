export const StorageKey = 'exifysettings';
export const OverlayHeight = 60;
export const OverlayCompactHeight = 40;
export const MinLongSideLength = 500;

export enum DefaultExifProperties {
  Model = 'Equipment',
  FocalLength = 'Focal length',
  FNumber = 'Aperture',
  ExposureTime = 'Exposure',
  ISO = 'Sensitivity',
}

export enum OptionalExifProperties {
  MeteringMode = 'Metering mode',
  ExposureProgram = 'Exposure mode',
  ExposureCompensation = 'Exposure bias',
  DateTimeOriginal = 'Date taken',
  Location = 'Location',
  Software = 'Software',
}

export const ExifProperties = {
  ...DefaultExifProperties,
  ...OptionalExifProperties,
};

export type ExifProperties = DefaultExifProperties | OptionalExifProperties;
