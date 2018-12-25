export interface IExifyImage extends HTMLImageElement {
  exifdata?: object;
}

export enum BackgroundMethods {
  READ_EXIF,
}
