import { DomListener } from './dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { IStorage, IExifData } from './types';

import './components/switch/switch';
import './components/exif/exif';

export class Exify {
  constructor(private document: Document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<IExifData>,
    storage: IStorage
  ) {
    const document = this.document;

    const overlay = new Overlay(this.document.body, {
      openSettings(exifData) {
        overlay.destroy();

        storage.get().then(settings =>
          new Settings(document.body)
            .show(exifData, settings)
            .then(updatedsettings => storage.save(updatedsettings))
            // tslint:disable-next-line: no-console
            .catch(e => e && console.error(e))
        );
      },
    });

    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad =>
        storage.get().then(settings => {
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
