import { Storage } from './storage';
import { Settings } from '../../components/settings/settings';
import { SettingsStorage } from '../../lib/settings-storage';

import '../../bootstrap';

export const init = (browser: typeof chrome) =>
  browser.tabs.query(
    { currentWindow: true, active: true },
    async ([{ url }]) => {
      const settingsStorage = new SettingsStorage(
        new Storage(browser),
        new URL(url)
      );

      try {
        const settings = await settingsStorage.get();
        const newSettings = await new Settings(document.body, {
          settings,
          animate: false,
        }).show();

        await settingsStorage.save(newSettings);
      } catch (e) {
        if (e) {
          // tslint:disable-next-line: no-console
          console.error(e);
        }
      }

      window.close();
    }
  );
