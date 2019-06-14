export enum BackgroundMethods {
  READ_EXIF,
  READ_HISTOGRAM,
}

export enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export const StorageKey = 'exifysettings';
export const OverlayHeight = 60;
export const MinLongSideLength = 600;
export const RequestTimeout = 4500;
