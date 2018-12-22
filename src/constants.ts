export enum ChromeBackgroundMethods {
  GET_EXIF_DATA,
}

export const OverlayExifProperties = [
  'Model',
  'FocalLength',
  'FNumber',
  'ExposureTime',
  'ISOSpeedRatings',
];

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
