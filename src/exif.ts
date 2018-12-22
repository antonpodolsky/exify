import * as exif from 'exif-js';
import { IExifyImage } from './types';
import { OverlayExifProperties } from './constants';

export const getExifData = (image: IExifyImage): Promise<object> =>
  new Promise(resolve =>
    exif.getData(image as any, () =>
      resolve(
        OverlayExifProperties.reduce((res, prop) => {
          res[prop] = image.exifdata[prop];
          return res;
        }, {})
      )
    )
  );
