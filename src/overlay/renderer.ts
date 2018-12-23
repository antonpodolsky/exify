import {
  OverlayClasses,
  OverlayExifProperties,
  OverlayHeight,
} from '../constants';

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

export const createOverlay = (document: Document, image: HTMLImageElement) => {
  const { top, left, width, height } = image.getBoundingClientRect();
  const overlay = document.createElement('div');

  overlay.innerHTML = getOverlayHtml();
  overlay.className = OverlayClasses.Overlay;
  overlay.style.top = `${top + height - OverlayHeight}px`;
  overlay.style.left = `${left}px`;
  overlay.style.width = `${width}px`;
  overlay.style.height = `${OverlayHeight}px`;

  return overlay;
};

export const renderExifData = (overlay: HTMLElement, exifData: object) =>
  (overlay.querySelector(
    `.${OverlayClasses.PropertyList}`
  ).innerHTML = getExifDataHtml(exifData));

export const setError = (overlay: HTMLElement) => {
  overlay.classList.add(`${OverlayClasses.Overlay}--error`);
};

export const setLoaded = (overlay: HTMLElement) => {
  overlay.classList.add(`${OverlayClasses.Overlay}--loaded`);
};
