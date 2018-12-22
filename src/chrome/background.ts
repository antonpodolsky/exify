import { getExifData } from '../utils/exif';
import { BackgroundMethods } from './api';

const Methods = {
  [BackgroundMethods.GET_EXIF_DATA]: (src: string, exifdata: object) =>
    getExifData({ src, exifdata } as any),
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Exify installed');
});

chrome.runtime.onMessage.addListener(
  ({ method, args }, sender, sendResponse) => {
    if (Methods[method]) {
      Methods[method](...args).then(sendResponse);
      return true;
    }
  }
);
