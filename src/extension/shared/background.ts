import { BackgroundMethods } from '../../constants';
import { readExif } from '../../lib/exif-reader';
import { readHistogram } from '../../lib/pixel-reader';

const Methods: { [key: string]: (...args) => Promise<any> } = {
  [BackgroundMethods.READ_EXIF]: (src: string, exifdata: object) =>
    readExif({ src, exifdata } as any),
  [BackgroundMethods.READ_HISTOGRAM]: (src: string) => readHistogram(src),
};

export const init = (browser: typeof chrome) =>
  browser.runtime.onMessage.addListener(({ method, args }, _, sendResponse) => {
    if (Methods[method]) {
      Methods[method](...args)
        .then(sendResponse)
        .catch(sendResponse);
      return true;
    }
  });
