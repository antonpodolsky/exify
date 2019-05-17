import * as exif from 'exif-js';
import { RequestTimeout } from '../constants';
import { IExifyImage, ExifProperties, IExifData } from '../types';
import { reduce, round } from '../utils';

const convertValue = (property: ExifProperties, value: any) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (property) {
    case ExifProperties.FocalLength:
      return round(value);
    case ExifProperties.FNumber:
    case ExifProperties.ExposureBias:
      return round(value, 1);
    case ExifProperties.ExposureTime:
      return round(value >= 1 ? value : 1 / value, 2);
    default:
      return value;
  }
};

export const formatValue = (prop: ExifProperties, value: any) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (prop) {
    case ExifProperties.FocalLength:
      return `${value}mm`;
    case ExifProperties.FNumber:
      return `f/${value}`;
    case ExifProperties.ExposureTime:
      return `${value}s`;
    case ExifProperties.ExposureBias:
      return value || 'Neutral';
    case ExifProperties.DateTimeOriginal:
      return (([date, hour]) => [
        date.replace(/\:/g, '/'),
        hour
          .split(':')
          .splice(0, 2)
          .join(':'),
      ])(value.split(' ')).join(' ');
    default:
      return value;
  }
};

export const readExif = (image: IExifyImage): Promise<IExifData> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    exif.getData(image as any, () => {
      const exifData = reduce(ExifProperties)(
        (res, prop: ExifProperties, key) =>
          typeof image.exifdata[key] !== 'undefined' &&
          (res[key] = {
            name: key,
            title: prop,
            value: formatValue(prop, convertValue(prop, image.exifdata[key])),
          })
      );

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
