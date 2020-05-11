import { ExifProperties } from './config';
import { round } from './utils';
import { dmsToDD, fetchLocationLink } from './lib/geo';
import { Css } from './components/markdown';

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
  ISO: identity,
  MeteringMode: identity,
  Software: identity,
  ExposureProgram: identity,
  Model: {
    html(value, exif) {
      return `
        <span class="${Css.Align} ${Css.SpaceH}">
          ${[
            `<span class="${Css.Align} ${Css.SpaceH} ${Css.X05}">
              <span class="${Css.Icon}">photo_camera</span>
              <span>${value}</span>
            </span>  
            `,
            exif.LensModel &&
              `<span class="${Css.Align} ${Css.SpaceH} ${Css.X05}">
              <span class="${Css.Icon}">camera</span>
              <span>${exif.LensModel}</span>
            </span>  
            `,
          ]
            .filter(v => v)
            .join('')}
        </span>
      `;
    },
  },
  DateTimeOriginal: {
    html(value: Date) {
      const date = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const [
        { value: month },
        ,
        { value: day },
        ,
        { value: year },
        ,
        { value: hour },
        ,
        { value: minute },
      ] = date.formatToParts(value);

      return `${month} ${day}, ${year} ${hour}:${minute}`;
    },
  },
  ExposureCompensation: {
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
    async html(value) {
      const link = value.length
        ? await fetchLocationLink(value[0], value[1]).catch(() => null)
        : null;

      return (
        link &&
        `<span class="${Css.Align} ${Css.SpaceH} ${Css.X05}">
          <span class="${Css.Icon}">place</span>
          ${link}
        </span>`
      );
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
