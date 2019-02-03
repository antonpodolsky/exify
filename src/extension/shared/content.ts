// import { readExif } from '../../lib/exif-reader';
import { readExif } from './bridge';
import { Exify } from '../../exify';
import { Storage } from './storage';
import { SettingsStorage } from '../../lib/settings-storage';

export const init = (browser: typeof chrome) =>
  new Exify(document).init(
    readExif(browser),
    new SettingsStorage(new Storage(browser), document.location as any)
  );
