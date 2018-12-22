import * as exif from 'exif-js';
import { OverlayExifProperties } from '../constants';
import { IExifyImage } from '../types';

export const getExifData = (image: IExifyImage): Promise<object> =>
  new Promise(resolve =>
    exif.getData(image as any, () => {
      const exifData = OverlayExifProperties.reduce((res, prop) => {
        res[prop] = image.exifdata[prop];
        return res;
      }, {});

      resolve(Object.keys(image.exifdata).length ? exifData : null);
    })
  );
