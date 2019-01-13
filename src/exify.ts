import { DomListener } from './dom-listener';
import { Overlay } from './views/overlay/overlay';
import { Settings } from './views/settings/settings';
import { IStorage } from './types';

export class Exify {
  constructor(private document) {}

  public init(
    readExif: (image: HTMLElement) => Promise<object>,
    storage: IStorage
  ) {
    const overlay = new Overlay(this.document);

    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad => {
        overlay.showOverlay(image);

        onImageLoad(() =>
          Promise.all([readExif(image), storage.getUserSettings()])
            .then(([exifData, userSettings]) =>
              overlay.showExif(exifData, userSettings)
            )
            .catch(() => overlay.showExif(null))
        );
      })
      .onScroll(() => overlay.remove())
      .onImageMouseOut(() => overlay.remove())
      .onSettingsClick(() => {
        overlay.remove();

        storage.getUserSettings().then(userSettings =>
          new Settings(this.document)
            .showSettings(overlay.getExifData(), userSettings)
            .then(updatedUserSettings =>
              storage.saveUserSettings(updatedUserSettings)
            )
            .catch(_ => _)
        );
      });
  }
}
