import { readExif } from '../utils/exif-reader';
import { BackgroundMethods } from '../constants';

const Methods: { [key: string]: (...args) => Promise<any> } = {
  [BackgroundMethods.READ_EXIF]: (src: string, exifdata: object) =>
    readExif({ src, exifdata } as any),
};

export const start = (browser: typeof chrome) => {
  browser.runtime.onMessage.addListener(
    ({ method, args }, sender, sendResponse) => {
      if (Methods[method]) {
        Methods[method](...args)
          .then(sendResponse)
          .catch(sendResponse);
        return true;
      }
    }
  );
};
