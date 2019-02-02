import { Storage } from './storage';
import { Settings } from '../../components/settings/settings';
import { SettingsStorage } from '../../lib/settings-storage';

import '../../components/switch/switch';

export const init = (browser: typeof chrome) =>
  browser.tabs.query({ currentWindow: true, active: true }, ([{ url }]) => {
    const settingsStorage = new SettingsStorage(
      new Storage(browser),
      new URL(url)
    );

    settingsStorage.get().then(settings =>
      new Settings(document.body, { animate: false })
        .show(settings)
        .then(updatedSettings => settingsStorage.save(updatedSettings))
        // tslint:disable-next-line: no-console
        .catch(e => e && console.error(e))
        .finally(window.close)
    );
  });
