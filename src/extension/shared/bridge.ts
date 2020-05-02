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

export const readExif = (browser: typeof chrome) => (
  image: IExifyImage,
  location: URL
) => {
  let src = image.getAttribute('src');

  if (image.getAttribute('src').indexOf('http') !== 0) {
    src = `${location.protocol}//${location.host}/${src}`;
  }

  return call<IExifData>(browser, BackgroundMethods.ReadExif, [
    src,
    image.exifdata,
  ]);
};

export const readHistogram = (browser: typeof chrome) => (src: string) =>
  call(browser, BackgroundMethods.ReadHistogram, [src]);
