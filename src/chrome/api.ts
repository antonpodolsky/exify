import { IExifyImage } from '../types';

export enum BackgroundMethods {
  GET_EXIF_DATA,
}

export const getExifData = (image: IExifyImage): Promise<object> =>
  new Promise(resolve =>
    chrome.runtime.sendMessage(
      {
        method: BackgroundMethods.GET_EXIF_DATA,
        args: [image.getAttribute('src'), image.exifdata],
      },
      resolve
    )
  );
