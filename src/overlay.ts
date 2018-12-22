import { OverlayHeight, OverlayExifProperties } from './constants';

const enum Classes {
  Overlay = 'exify-overlay',
  Background = 'exify-background',
  Content = 'exify-content',
  ExifPropertyList = 'exify-property-list',
  ExifPropertyName = 'exify-property-name',
  ExifPropertyValue = 'exify-property-value',
}

const getHtml = (exifData: object) => `
  <div class="${Classes.Background}"></div>
  <div class="${Classes.Content}">
    <ul class="${Classes.ExifPropertyList}">
      ${OverlayExifProperties.map(
        exifProp => `
      <li>
        <div class="${Classes.ExifPropertyName}">${exifProp}</div>
        <div class="${Classes.ExifPropertyValue}">${exifData[exifProp]}</div>
      </li>
    `
      ).join('')}</ul>
  </div>
`;

export class Overlay {
  constructor(private document: Document) {}

  public render(image: HTMLImageElement, exifData: object) {
    const { top, left, width, height } = image.getBoundingClientRect();
    const overlay = this.document.createElement('div');

    overlay.innerHTML = getHtml(exifData);
    overlay.className = Classes.Overlay;
    overlay.style.top = `${top + height - OverlayHeight}px`;
    overlay.style.left = `${left}px`;
    overlay.style.width = `${width}px`;
    overlay.style.height = `${OverlayHeight}px`;

    this.document.body.appendChild(overlay);
  }

  public remove() {
    this.document
      .querySelectorAll(`.${Classes.Overlay}`)
      .forEach(element => element.remove());
  }
}
