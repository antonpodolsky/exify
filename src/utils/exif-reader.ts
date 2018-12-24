import * as exif from 'exif-js';
import { OverlayExifProperties } from '../constants';
import { IExifyImage } from '../types';

const convertVlaue = (property: OverlayExifProperties, value: any) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (property) {
    case OverlayExifProperties.FNumber:
      return Math.round(value * 10) / 10;
    case OverlayExifProperties.ExposureTime:
      return value >= 1 ? value : `1/${1 / value}`;
    default:
      return value;
  }
};

export const readExif = (image: IExifyImage): Promise<object> =>
  new Promise(resolve =>
    exif.getData(image as any, () => {
      const exifData = Object.keys(OverlayExifProperties).reduce(
        (res, prop) => {
          if (typeof image.exifdata[prop] !== 'undefined') {
            res[prop] = convertVlaue(
              OverlayExifProperties[prop],
              image.exifdata[prop]
            );
          }
          return res;
        },
        {}
      );

      resolve(
        typeof exifData === 'object' && Object.keys(exifData).length
          ? exifData
          : null
      );
    })
  );
