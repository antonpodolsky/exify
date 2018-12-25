import { readExif } from './bridge';
import { Exify } from '../exify';

export const start = (browser: typeof chrome) =>
  new Exify(document).init(readExif(browser));
