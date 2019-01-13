import { CssClasses, OverlayHeight } from '../../constants';
import * as ExifRenderer from '../exif/exif-renderer';
import { IExifData } from '../../types';

const getOverlayHtml = () => `
  <div class="${CssClasses.OverlayBackground}"></div>
  <div class="${CssClasses.OverlayContent}">
    <div class="${CssClasses.Loader}"></div>
    <span class="${CssClasses.OverlaySettingsToggle} ${
  CssClasses.Icon
}">more_horiz</span>
    <div class="${CssClasses.OverlayPropertyList}"></div>
  </div>
`;

export const createOverlay = (document: Document, image: HTMLImageElement) => {
  const overlay = document.createElement('div');
  const { top, left, width, height } = image.getBoundingClientRect();

  overlay.innerHTML = getOverlayHtml();
  overlay.className = CssClasses.Overlay;
  overlay.style.top = `${top + height - OverlayHeight}px`;
  overlay.style.left = `${left}px`;
  overlay.style.width = `${width}px`;
  overlay.style.height = `${OverlayHeight}px`;

  return overlay;
};

export const renderExif = (overlay: HTMLElement, exifData: IExifData) =>
  ExifRenderer.renderExif(
    overlay.querySelector(`.${CssClasses.OverlayPropertyList}`),
    exifData
  );

export const setError = (overlay: HTMLElement) => {
  overlay.classList.add(`${CssClasses.Overlay}--error`);
};

export const setLoaded = (overlay: HTMLElement) => {
  overlay.classList.add(`${CssClasses.Overlay}--loaded`);
};
