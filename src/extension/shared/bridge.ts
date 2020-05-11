import { IExifData } from '../../types';
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

export const fetchExif = (browser: typeof chrome) => (
  src: string,
  location: URL
) => {
  if (src.indexOf('http') !== 0) {
    src = `${location.protocol}//${location.host}/${src}`;
  }

  return call<IExifData>(browser, BackgroundMethods.FetchExif, [src]);
};

export const fetchHistogram = (browser: typeof chrome) => (src: string) =>
  call(browser, BackgroundMethods.FetchHistogram, [src]);
