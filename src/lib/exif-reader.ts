import * as exif from 'exif-js';
import { RequestTimeout } from '../constants';
import { IExifyImage, IExifData } from '../types';
import { map, reduce, round } from '../utils';
import { dmsToDD, fetchLocationLink } from '../lib/geo';
import { ExifProperties } from '../config';

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
      return [
        [exifData.GPSLatitude, exifData.GPSLatitudeRef],
        [exifData.GPSLongitude, exifData.GPSLongitudeRef],
      ]
        .filter(x => !!x[0])
        .map(([location, ref]) => dmsToDD(location, ref));
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
          ? fetchLocationLink(value[0], value[1])
              .then(res => resolve([res, true]))
              .catch(() => resolve(null))
          : resolve(null);
      default:
        return resolve(value);
    }
  });

const resolveValue = async (prop, key, exifData) => {
  if (!isValidProperty(key as string, exifData[key])) {
    return [null, false];
  }

  const value = await formatValue(
    prop,
    convertValue(prop, exifData[key], exifData),
    exifData[key]
  );

  return Array.isArray(value) ? value : [value, false];
};

export const readExif = (image: IExifyImage): Promise<IExifData> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    exif.getData(image as any, async () => {
      let exifData = await Promise.all(
        map(ExifProperties, [])(async (prop: ExifProperties, key) => {
          const [value, isHtml] = await resolveValue(prop, key, image.exifdata);

          return {
            name: key,
            title: prop,
            value,
            isHtml,
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
