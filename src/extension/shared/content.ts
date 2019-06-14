// import { readExif } from '../../lib/exif-reader';
import { readExif, readHistogram } from './bridge';
import { Exify } from '../../exify';
import { Storage } from './storage';
import { SettingsStorage } from '../../lib/settings-storage';

export const init = (browser: typeof chrome) =>
  new Exify(
    document,
    new SettingsStorage(new Storage(browser), document.location as any),
    readExif(browser),
    readHistogram(browser)
  );
