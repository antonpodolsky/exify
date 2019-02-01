import { readExif } from '../../lib/exif-reader';
import { Exify } from '../../exify';
import { Storage } from './storage';

export const init = (browser: typeof chrome) =>
  new Exify(document).init(
    readExif,
    new Storage(browser, document.location as any)
  );
