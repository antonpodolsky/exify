import { DomListener } from './dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { SettingsStorage } from './lib/settings-storage';
import { IExifData } from './types';

import './components/exify.scss';
import './components/switch/switch';
import './components/exif/exif';

export class Exify {
  constructor(private document: Document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<IExifData>,
    settingsStorage: SettingsStorage
  ) {
    let overlay: Overlay;
    const document = this.document;
    let src;

    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad =>
        settingsStorage.get().then(settings => {
          if (!settings.enabled) {
            return;
          }

          if (overlay) {
            overlay.destroy();
          }

          src = image.src;

          overlay = new Overlay(image, this.document.body, {
            onOpenSettings(exifData) {
              overlay.destroy();

              new Settings(document.body)
                .show(settings, exifData)
                .then(updatedSettings => settingsStorage.save(updatedSettings))
                // tslint:disable-next-line: no-console
                .catch(e => e && console.error(e));
            },
          });

          onImageLoad(() =>
            readExif(image)
              .then(
                exifData =>
                  src === image.src && overlay.showExif(exifData, settings)
              )
              .catch(() => overlay.showExif(null))
          );
        })
      )
      .onScroll(() => overlay && overlay.reposition())
      .onImageMouseOut(() => overlay && overlay.destroy());
  }
}
