export enum OverlayExifProperties {
  Model = 'Camera',
  FocalLength = 'Focal length',
  FNumber = 'Aperture',
  ExposureTime = 'Exposure',
  ISOSpeedRatings = 'ISO',
}

export enum OverlayClasses {
  Overlay = 'exify-overlay',
  Background = 'exify-background',
  Content = 'exify-content',
  Loader = 'exify-loader',
  PropertyList = 'exify-property-list',
  PropertyName = 'exify-property-name',
  PropertyValue = 'exify-property-value',
  Icon = 'exify-icon',
}

export const OverlayHeight = 60;
export const MinLongSideLength = 600;
export const RequestTimeout = 4500;
