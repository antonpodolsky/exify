import { OverlayClasses, OverlayHeight } from '../constants';

import { DomListener } from '../utils/dom-listener';
import { getOverlayHtml, getExifDataHtml } from './renderer';

export class Overlay {
  private overlay: HTMLElement;

  constructor(private document: Document, private domListener: DomListener) {}

  private create(image: HTMLImageElement) {
    const { top, left, width, height } = image.getBoundingClientRect();
    const overlay = this.document.createElement('div');

    overlay.innerHTML = getOverlayHtml();
    overlay.className = OverlayClasses.Overlay;
    overlay.style.top = `${top + height - OverlayHeight}px`;
    overlay.style.left = `${left}px`;
    overlay.style.width = `${width}px`;
    overlay.style.height = `${OverlayHeight}px`;

    return overlay;
  }

  private attach(overlay: HTMLElement, image: HTMLImageElement) {
    this.document.body.appendChild(overlay);
    this.domListener.onOverlayMouseOut(overlay, image, () => this.remove());

    return overlay;
  }

  public renderOverlay(image: HTMLImageElement) {
    this.remove();

    this.overlay = this.attach(this.create(image), image);
  }

  public renderExifData(exifData: object) {
    if (!this.overlay) {
      return;
    }

    if (!exifData) {
      this.overlay.classList.add(`${OverlayClasses.Overlay}--error`);
      return;
    }

    this.overlay.querySelector(
      `.${OverlayClasses.PropertyList}`
    ).innerHTML = getExifDataHtml(exifData);

    this.overlay.classList.add(`${OverlayClasses.Overlay}--loaded`);
  }

  public remove() {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = null;
  }
}
