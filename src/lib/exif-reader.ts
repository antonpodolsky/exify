import * as exif from 'exif-js';
import { RequestTimeout } from '../constants';
import { IExifyImage, ExifProperties } from '../types';

const convertValue = (property: ExifProperties, value: any) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (property) {
    case ExifProperties.FocalLength:
      return Math.round(value);
    case ExifProperties.FNumber:
    case ExifProperties.ExposureBias:
      return Math.round(value * 10) / 10;
    case ExifProperties.ExposureTime:
      return value >= 1 ? value : `1/${1 / value}`;
    default:
      return value;
  }
};

export const readExif = (image: IExifyImage): Promise<object> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    exif.getData(image as any, () => {
      const exifData = Object.keys(ExifProperties).reduce((res, prop) => {
        if (typeof image.exifdata[prop] !== 'undefined') {
          res[prop] = convertValue(ExifProperties[prop], image.exifdata[prop]);
        }
        return res;
      }, {});

      return (
        !timedOut &&
        resolve(
          typeof exifData === 'object' && Object.keys(exifData).length
            ? exifData
            : null
        )
      );
    });

    setTimeout(() => {
      timedOut = true;
      reject();
    }, RequestTimeout);
  });
