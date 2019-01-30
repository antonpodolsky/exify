import { DomListener } from './dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { IStorage, IExifData } from './types';

import './components/switch/switch';
import './components/exif/exif';

export class Exify {
  constructor(private document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<IExifData>,
    storage: IStorage
  ) {
    const document = this.document;

    const overlay = new Overlay(this.document.body, {
      openSettings(exifData) {
        overlay.destroy();

        storage.getUserSettings().then(userSettings =>
          new Settings(document.body)
            .show(exifData, userSettings)
            .then(updatedUserSettings =>
              storage.saveUserSettings(updatedUserSettings)
            )
            // tslint:disable-next-line: no-console
            .catch(e => e && console.error(e))
        );
      },
    });

    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad => {
        overlay.show(image);

        onImageLoad(() =>
          Promise.all([readExif(image), storage.getUserSettings()])
            .then(([exifData, userSettings]) =>
              overlay.exif(exifData, userSettings)
            )
            .catch(() => overlay.exif(null))
        );
      })
      .onScroll(() => overlay.destroy())
      .onImageMouseOut(() => overlay.destroy());
  }
}
