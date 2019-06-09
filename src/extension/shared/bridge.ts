import { IExifyImage, IExifData } from '../../types';
import { BackgroundMethods } from '../../constants';

export const readExif = (browser: typeof chrome) => (image: IExifyImage) =>
  new Promise<IExifData>(resolve => {
    browser.runtime.sendMessage(
      {
        method: BackgroundMethods.READ_EXIF,
        args: [image.getAttribute('src'), image.exifdata],
      },
      resolve
    );
  });

export const readHistogram = (browser: typeof chrome) => (src: string) =>
  new Promise<IExifData>(resolve => {
    browser.runtime.sendMessage(
      {
        method: BackgroundMethods.READ_HISTOGRAM,
        args: [src],
      },
      resolve
    );
  });
