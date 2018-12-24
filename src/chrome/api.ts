import { IExifyImage } from '../types';

export enum BackgroundMethods {
  READ_EXIF,
}

export const readExif = (image: IExifyImage): Promise<object> =>
  new Promise(resolve => {
    let src = image.getAttribute('src');

    if (src.startsWith('/')) {
      src = location.protocol + '//' + location.host + src;
    }

    chrome.runtime.sendMessage(
      {
        method: BackgroundMethods.READ_EXIF,
        args: [image.getAttribute('src'), image.exifdata],
      },
      resolve
    );
  });
