import * as exif from 'exif-js';
import { RequestTimeout } from '../constants';
import { IExifyImage, ExifProperties, IExifData } from '../types';
import { map, reduce, round, dmsToDD, fetchLocationString } from '../utils';

const isValidProperty = (key: string, value: any) => {
  return typeof value !== 'undefined' || (key as string).charAt(0) === '_';
};

const convertValue = (property: ExifProperties, value: any, exifData: any) => {
  switch (property) {
    case ExifProperties.FocalLength:
      return round(value);
    case ExifProperties.FNumber:
    case ExifProperties.ExposureBias:
      return round(value, 1);
    case ExifProperties.ExposureTime:
      return round(value >= 1 ? value : 1 / value, 1);
    case ExifProperties._Location:
      return [exifData.GPSLatitude, exifData.GPSLongitude]
        .filter(x => !!x)
        .map(location => dmsToDD(location, exifData.GPSLatitudeRef));
    default:
      return value;
  }
};

export const formatValue = (
  prop: ExifProperties,
  value: any,
  originalValue: any
): Promise<any> =>
  new Promise(resolve => {
    if (typeof value === 'undefined') {
      resolve(null);
      return;
    }

    switch (prop) {
      case ExifProperties.FocalLength:
        return resolve(`${value}mm`);
      case ExifProperties.FNumber:
        return resolve(`f/${value}`);
      case ExifProperties.ExposureTime:
        return resolve(`${originalValue >= 1 ? value : `1/${value}`}s`);
      case ExifProperties.ExposureBias:
        return resolve(`${value >= 0 ? '+' : ''}${value}`);
      case ExifProperties.DateTimeOriginal:
        return resolve(
          (([date, hour]) => [
            date.replace(/\:/g, '/'),
            hour
              .split(':')
              .splice(0, 2)
              .join(':'),
          ])(value.split(' ')).join(' ')
        );
      case ExifProperties._Location:
        return value.length
          ? fetchLocationString(value[0], value[1])
              .then(resolve)
              .catch(() => resolve(null))
          : resolve(null);
      default:
        return resolve(value);
    }
  });

const resolveValue = (prop, key, exifData) => {
  if (!isValidProperty(key as string, exifData[key])) {
    return null;
  }

  return formatValue(
    prop,
    convertValue(prop, exifData[key], exifData),
    exifData[key]
  );
};

export const readExif = (image: IExifyImage): Promise<IExifData> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    exif.getData(image as any, async () => {
      let exifData = await Promise.all(
        map(ExifProperties, [])(async (prop: ExifProperties, key) => {
          return {
            name: key,
            title: prop,
            value: await resolveValue(prop, key, image.exifdata),
          };
        })
      );

      exifData = exifData.filter(prop => prop.value !== null).length
        ? reduce(exifData, {})((res, value) => (res[value.name] = value))
        : null;

      return !timedOut && resolve(exifData as any);
    });

    setTimeout(() => {
      timedOut = true;
      reject();
    }, RequestTimeout);
  });
