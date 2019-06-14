import { DomListener } from './lib/dom-listener';
import { Overlay } from './components/overlay/overlay';
import { Settings } from './components/settings/settings';
import { SettingsStorage } from './lib/settings-storage';
import { IExifData, ISettings } from './types';

import './bootstrap';

export class Exify {
  private image: HTMLImageElement;
  private overlay: Overlay;

  constructor(
    private document: Document,
    private settingsStorage: SettingsStorage,
    private readExif: (image: HTMLElement) => Promise<IExifData>,
    private readHistogram: (src: string) => Promise<any>
  ) {
    new DomListener(this.document)
      .onImageMouseIn(image => onImageLoad =>
        this.showOverlay(image, onImageLoad)
      )
      .onImageMouseOut(() => this.destroyOverlay())
      .onScroll(() => this.repositionOverlay());
  }

  private async showOverlay(image: HTMLImageElement, onImageLoad: any) {
    this.image = image;

    try {
      const settings = await this.settingsStorage.get();

      if (!settings.enabled) {
        return;
      }

      this.createOverlay(image, settings);

      onImageLoad(img => this.updateOverlay(img));
    } catch (e) {
      if (e) {
        // tslint:disable-next-line: no-console
        console.error(e);
      }
    }
  }

  private async updateOverlay(image) {
    try {
      const exifData = await this.readExif(image);

      if (this.overlay && this.image.src === image.src) {
        this.overlay.showExif(exifData);
      }
    } catch (e) {
      if (this.overlay) {
        this.overlay.showExif(null);
      }

      if (e) {
        // tslint:disable-next-line: no-console
        console.error(e);
      }
    }
  }

  private createOverlay(image: HTMLImageElement, settings: ISettings) {
    this.destroyOverlay();

    this.overlay = new Overlay(document.body, {
      image,
      settings,
      onOpenSettings: async exifData => this.openSettings(exifData, settings),
      onMouseOut: () => this.destroyOverlay(),
    });
  }

  private async openSettings(exifData: IExifData, settings: ISettings) {
    this.destroyOverlay();

    try {
      const newSettings = await new Settings(document.body, {
        exifData,
        settings,
        animate: true,
        readHistogram: this.readHistogram.bind(null, this.image.src),
      }).show();

      this.settingsStorage.save(newSettings);
    } catch (e) {
      if (e) {
        // tslint:disable-next-line: no-console
        console.error(e);
      }
    }
  }

  private repositionOverlay() {
    if (this.overlay) {
      this.overlay.reposition();
    }
  }

  private destroyOverlay() {
    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
    }
  }
}
