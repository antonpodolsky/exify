import exifr from 'exifr';
import { IExifData } from '../types';
import { map, reduce, fetchlBlob } from '../utils';
import { ExifProperties } from '../config';
import { formatExifProp } from '../formatter';

export const fetchExif = (src: string): Promise<IExifData> =>
  fetchlBlob(src)
    .then(blob => exifr.parse(blob, { xmp: true }))
    .then(async data => {
      if (!data) {
        return Promise.reject();
      }

      const exifData = await Promise.all(
        map(ExifProperties, [])(async (title: ExifProperties, name) => {
          const { value, isHtml } = await formatExifProp(
            name,
            data[name],
            data
          );

          return {
            name,
            title,
            value,
            isHtml,
          };
        })
      );

      if (!exifData.filter(prop => prop.value !== null).length) {
        return Promise.reject();
      }

      return reduce(exifData, {})((res, value) => (res[value.name] = value));
    });
