import { ExifProperties } from './config';
import { round } from './utils';
import { dmsToDD, fetchLocationLink } from './lib/geo';

interface IFormatter {
  convert?(value?: any, exif?: Record<string, any>): any;
  text?(value?: any, exif?: Record<string, any>, originalValue?: any): any;
  html?(value?: any, exif?: Record<string, any>, originalValue?: any): any;
  isCompound?: boolean;
}

const identity = {
  text(value) {
    return value;
  },
};

const formatters: Record<keyof typeof ExifProperties, IFormatter> = {
  ISOSpeedRatings: identity,
  MeteringMode: identity,
  Model: identity,
  Software: identity,
  ExposureProgram: identity,
  DateTimeOriginal: {
    text(value: string) {
      const [date, hour] = value.split(' ');

      return [
        date
          .split(':')
          .reverse()
          .join('/'),
        hour
          .split(':')
          .splice(0, 2)
          .join(':'),
      ].join(' ');
    },
  },
  ExposureBias: {
    convert(value) {
      return round(value, 1);
    },
    text(value) {
      return `${value >= 0 ? '+' : ''}${value}`;
    },
  },
  ExposureTime: {
    convert(value) {
      return round(value >= 1 ? value : 1 / value, 1);
    },
    text(value, exif, originalValue) {
      return `${originalValue >= 1 ? value : `1/${value}`}s`;
    },
  },
  FNumber: {
    convert(value) {
      return round(value, 1);
    },
    text(value) {
      return `f/${value}`;
    },
  },
  FocalLength: {
    convert(value) {
      return round(value);
    },
    text(value) {
      return `${value}mm`;
    },
  },
  Location: {
    isCompound: true,
    convert(value, exif) {
      return [
        [exif.GPSLatitude, exif.GPSLatitudeRef],
        [exif.GPSLongitude, exif.GPSLongitudeRef],
      ]
        .filter(x => !!x[0])
        .map(([location, ref]) => dmsToDD(location, ref));
    },
    html(value) {
      return value.length
        ? fetchLocationLink(value[0], value[1]).catch(() => null)
        : null;
    },
  },
};

export const formatExifProp = (
  name: keyof typeof ExifProperties,
  value: any,
  exif: Record<string, any>
) =>
  new Promise<{ value: any; isHtml: boolean }>(async resolve => {
    let val = null;
    let isHtml = false;

    const { isCompound, convert, text, html } = formatters[name];

    if (!isCompound && typeof value === 'undefined') {
      resolve({ value: val, isHtml });
      return;
    }

    val = convert ? await convert(value, exif) : value;
    val = text ? await text(val, exif, value) : val;

    if (html) {
      val = await html(val, exif, value);
      isHtml = true;
    }

    return resolve({ value: val, isHtml });
  });
