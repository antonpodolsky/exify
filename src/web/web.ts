import { fetchExif } from '../lib/exif-reader';
import { fetchHistogram } from '../utils';
import { Exify } from '../exify';
import { Storage } from './storage';
import { SettingsStorage } from '../lib/settings-storage';

new Exify(
  document,
  new SettingsStorage(new Storage(), document.location as any),
  fetchExif,
  fetchHistogram
);
