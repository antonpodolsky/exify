import { readExif } from '../lib/exif-reader';
import { readHistogram } from '../lib/pixel-reader';
import { Exify } from '../exify';
import { Storage } from './storage';
import { SettingsStorage } from '../lib/settings-storage';

new Exify(
  document,
  new SettingsStorage(new Storage(), document.location as any),
  readExif,
  readHistogram
);
