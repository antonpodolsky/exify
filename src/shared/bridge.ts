import { IExifyImage } from '../types';
import { BackgroundMethods } from '../types';

export const readExif = (browser: typeof chrome) => (
  image: IExifyImage
): Promise<object> =>
  new Promise(resolve => {
    const fn = () => {
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
    };

    image.complete ? fn() : image.addEventListener('load', fn);
  });
