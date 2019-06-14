import { ExifProperties } from './config';
import { round } from './utils';
import { dmsToDD, fetchLocationLink } from './lib/geo';

interface IFormatter {
  convert?(value?: any, exif?: Record<string, any>): any;
  text?(value?: any, exif?: Record<string, any>, originalValue?: any): any;
  html?(value?: any, exif?: Record<string, any>, originalValue?: any): any;
  compound?: boolean;
}

const identity = {
  text(value) {
    return value;
  },
};

const props: Record<keyof typeof ExifProperties, IFormatter> = {
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
    compound: true,
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
  new Promise<{ value: any; isHtml: boolean }>(async (resolve, reject) => {
    let val = null;
    let isHtml = false;

    const { compound, convert, text, html } = props[name];

    if (!compound && typeof value === 'undefined') {
      resolve({ value: null, isHtml });
      return;
    }

    val = convert ? convert(value, exif) : value;
    val = text ? text(val, exif, value) : val;

    if (html) {
      val = html(val, exif, value);
      isHtml = true;
    }

    if (val instanceof Promise) {
      val = await val;
    }

    return resolve({ value: val, isHtml });
  });
