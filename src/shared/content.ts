// import { readExif } from './bridge';
import { readExif } from '../utils/exif-reader';
import { Exify } from '../exify';

export const start = (browser: typeof chrome) =>
  new Exify(document).init(readExif);
