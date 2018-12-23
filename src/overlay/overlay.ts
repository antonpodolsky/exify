import {
  OverlayClasses,
  OverlayExifProperties,
  OverlayHeight,
} from '../constants';

import { DomListener } from '../utils/dom-listener';

const formatExifPropertyValue = (
  property: OverlayExifProperties,
  value: any
) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (property) {
    case OverlayExifProperties.FocalLength:
      return `${value}mm`;
    case OverlayExifProperties.FNumber:
      return `f/${value}`;
    case OverlayExifProperties.ExposureTime:
      return `${value}s`;
    default:
      return value;
  }
};

const getOverlayHtml = () => `
  <div class="${OverlayClasses.Background}"></div>
  <div class="${OverlayClasses.Content}">
    <span class="${OverlayClasses.Loader} ${OverlayClasses.Icon}">camera</span>
    <div class="${OverlayClasses.PropertyList}"></div>
  </div>
`;

const getExifDataHtml = (exifData: object) =>
  Object.keys(OverlayExifProperties)
    .map(
      exifProp => `
      <div>
        <div class="${OverlayClasses.PropertyName}">${
        OverlayExifProperties[exifProp]
      }</div>
        <div class="${OverlayClasses.PropertyValue}">${formatExifPropertyValue(
        OverlayExifProperties[exifProp],
        exifData[exifProp]
      )}</div>
      </div>
    `
    )
    .join('');

export class Overlay {
  private overlay: HTMLElement;

  constructor(private document: Document, private domListener: DomListener) {}

  public renderOverlay(image: HTMLImageElement) {
    this.remove();

    const { top, left, width, height } = image.getBoundingClientRect();
    const overlay = (this.overlay = this.document.createElement('div'));

    overlay.innerHTML = getOverlayHtml();
    overlay.className = OverlayClasses.Overlay;
    overlay.style.top = `${top + height - OverlayHeight}px`;
    overlay.style.left = `${left}px`;
    overlay.style.width = `${width}px`;
    overlay.style.height = `${OverlayHeight}px`;

    this.document.body.appendChild(overlay);
    this.domListener.onOverlayMouseOut(overlay, () => this.remove());
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
    this.overlay = null;
    this.document
      .querySelectorAll(`.${OverlayClasses.Overlay}`)
      .forEach(element => element.remove());
  }
}
