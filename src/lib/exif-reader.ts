import * as exif from 'exif-js';
import { RequestTimeout } from '../config';
import { IExifyImage, IExifData } from '../types';
import { map, reduce } from '../utils';
import { ExifProperties } from '../config';
import { formatExifProp } from '../formatter';

export const readExif = (image: IExifyImage): Promise<IExifData> =>
  new Promise((resolve, reject) => {
    let timedOut = false;

    exif.getData(image as any, async () => {
      const exifData = await Promise.all(
        map(ExifProperties, [])(async (title: ExifProperties, name) => {
          const { value, isHtml } = await formatExifProp(
            name,
            image.exifdata[name],
            image.exifdata
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
