import { readExif } from '../utils/exif-reader';
import { BackgroundMethods } from './api';

const Methods = {
  [BackgroundMethods.READ_EXIF]: (src: string, exifdata: object) =>
    readExif({ src, exifdata } as any),
};

chrome.runtime.onMessage.addListener(
  ({ method, args }, sender, sendResponse) => {
    if (Methods[method]) {
      Methods[method](...args).then(sendResponse);
      return true;
    }
  }
);
