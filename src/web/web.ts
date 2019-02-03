import { readExif } from '../lib/exif-reader';
import { Exify } from '../exify';
import { Storage } from './storage';
import { SettingsStorage } from '../lib/settings-storage';

new Exify(document).init(
  readExif,
  new SettingsStorage(new Storage(), document.location as any)
);
