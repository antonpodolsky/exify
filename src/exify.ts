import { DomListener } from './dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { IStorage } from './types';

export class Exify {
  constructor(private document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<object>,
    storage: IStorage
  ) {
    const document = this.document;

    const overlay = new Overlay(this.document.body, {
      settings(exifData) {
        overlay.destroy();

        storage.getUserSettings().then(userSettings =>
          new Settings(document.body)
            .open(exifData, userSettings)
            .then(updatedUserSettings =>
              storage.saveUserSettings(updatedUserSettings)
            )
            .catch(() => null)
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
