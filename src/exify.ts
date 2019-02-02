import { DomListener } from './dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { SettingsStorage } from './lib/settings-storage';
import { IExifData } from './types';

import './components/switch/switch';
import './components/exif/exif';

export class Exify {
  constructor(private document: Document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<IExifData>,
    settingsStorage: SettingsStorage
  ) {
    const document = this.document;

    const overlay = new Overlay(this.document.body, {
      openSettings(exifData) {
        overlay.destroy();

        settingsStorage.get().then(settings =>
          new Settings(document.body)
            .show(settings, exifData)
            .then(updatedSettings => settingsStorage.save(updatedSettings))
            // tslint:disable-next-line: no-console
            .catch(e => e && console.error(e))
        );
      },
    });

    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad =>
        settingsStorage.get().then(settings => {
          if (!settings.enabled) {
            return;
          }

          overlay.show(image);

          onImageLoad(() =>
            readExif(image)
              .then(exifData => overlay.exif(exifData, settings))
              .catch(() => overlay.exif(null))
          );
        })
      )
      .onScroll(() => overlay.destroy())
      .onImageMouseOut(() => overlay.destroy());
  }
}
