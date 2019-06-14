import { IExifyImage, IExifData } from '../../types';
import { BackgroundMethods } from '../../constants';

const call = <T = any>(browser, method: BackgroundMethods, args: any[]) =>
  new Promise<T>(resolve => {
    browser.runtime.sendMessage(
      {
        method,
        args,
      },
      resolve
    );
  });

export const readExif = (browser: typeof chrome) => (image: IExifyImage) =>
  call<IExifData>(browser, BackgroundMethods.ReadExif, [
    image.getAttribute('src'),
    image.exifdata,
  ]);

export const readHistogram = (browser: typeof chrome) => (src: string) =>
  call(browser, BackgroundMethods.ReadHistogram, [src]);
