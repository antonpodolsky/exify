import { IExifyImage } from '../../types';
import { BackgroundMethods } from '../../constants';

export const readExif = (browser: typeof chrome) => (image: IExifyImage) =>
  new Promise<object>(resolve => {
    let src = image.getAttribute('src');

    if (src.startsWith('/')) {
      src = location.protocol + '//' + location.host + src;
    }

    browser.runtime.sendMessage(
      {
        method: BackgroundMethods.READ_EXIF,
        args: [image.getAttribute('src'), image.exifdata],
      },
      resolve
    );
  });
