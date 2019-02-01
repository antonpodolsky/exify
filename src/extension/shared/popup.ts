import { Storage } from './storage';
import { Settings } from '../../components/settings/settings';

import '../../components/switch/switch';

export const init = (browser: typeof chrome) =>
  browser.tabs.query({ currentWindow: true, active: true }, ([{ url }]) => {
    const storage = new Storage(browser, new URL(url));

    storage.get().then(settings =>
      setTimeout(
        () =>
          new Settings(document.body)
            .show({}, settings)
            .then(updatedSettings => storage.save(updatedSettings))
            // tslint:disable-next-line: no-console
            .catch(e => e && console.error(e))
            .finally(window.close),
        30
      )
    );
  });
