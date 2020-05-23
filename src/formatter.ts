import { ExifProperties } from './config';
import { round, dmsToDD, fetchLocationLink, escapeHTML } from './utils';
import { Css } from './css';

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
  MeteringMode: identity,
  Software: identity,
  ExposureProgram: identity,
  Model: {
    html(value, exif) {
      const lens = exif.LensModel || exif.Lens;

      return `
        <span class="${Css.Align} ${Css.SpaceH}">
          ${[
            `<span class="${Css.Align} ${Css.SpaceH} ${Css.X05}">
              <span class="${Css.Icon} ${Css.ColorGray}">photo_camera</span>
              <span>${escapeHTML(value)}</span>
            </span>  
            `,
            lens &&
              `<span class="${Css.Align} ${Css.SpaceH} ${Css.X05}">
              <span class="${Css.Icon} ${Css.ColorGray}">camera</span>
              <span>${escapeHTML(lens)}</span>
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
    html(value, exif, originalValue) {
      return `${originalValue >= 1 ? '' : `<span>1/</span>`}<span>${escapeHTML(
        value
      )}</span><span>s</span>`;
    },
  },
  FNumber: {
    convert(value) {
      return round(value, 1);
    },
    html(value) {
      return `<span>f/</span><span>${escapeHTML(value)}</span>`;
    },
  },
  FocalLength: {
    convert(value) {
      return round(value);
    },
    html(value, exif, originalValue) {
      return `<span>${escapeHTML(value)}</span><span>mm</span>`;
    },
  },
  ISO: {
    html(value) {
      return `<span>
        <span class="${Css.TextXs}">ISO</span>
        <span>${escapeHTML(value)}</span>
      </span>`;
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
          <span class="${Css.Icon} ${Css.ColorOrange}">place</span>
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
