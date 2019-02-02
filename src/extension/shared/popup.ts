import { Storage } from './storage';
import { Settings } from '../../components/settings/settings';

import '../../components/switch/switch';

export const init = (browser: typeof chrome) =>
  browser.tabs.query({ currentWindow: true, active: true }, ([{ url }]) => {
    const storage = new Storage(browser, new URL(url));

    storage.get().then(settings =>
      new Settings(document.body, { animate: false })
        .show(settings)
        .then(updatedSettings => storage.save(updatedSettings))
        // tslint:disable-next-line: no-console
        .catch(e => e && console.error(e))
        .finally(window.close)
    );
  });
