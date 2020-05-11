import exifr from 'exifr';
import { RequestTimeout } from '../config';
import { IExifyImage, IExifData } from '../types';
import { map, reduce, fetchlBlob } from '../utils';
import { ExifProperties } from '../config';
import { formatExifProp } from '../formatter';

export const fetchExif = (image: IExifyImage): Promise<IExifData> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    fetchlBlob(image.src)
      .then(blob => exifr.parse(blob, { xmp: true }))
      .then(async data => {
        image.exifdata = data;

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

        if (!timedOut && exifData.filter(prop => prop.value !== null).length) {
          resolve(
            reduce(exifData, {})((res, value) => (res[value.name] = value))
          );
        } else {
          reject();
        }
      });

    setTimeout(() => {
      timedOut = true;
      reject(new Error(`Request timed out after ${RequestTimeout}ms`));
    }, RequestTimeout);
  });
