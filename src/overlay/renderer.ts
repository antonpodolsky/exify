import { OverlayClasses, OverlayExifProperties } from '../constants';

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

export const getOverlayHtml = () => `
  <div class="${OverlayClasses.Background}"></div>
  <div class="${OverlayClasses.Content}">
    <span class="${OverlayClasses.Loader} ${OverlayClasses.Icon}">camera</span>
    <div class="${OverlayClasses.PropertyList}"></div>
  </div>
`;

export const getExifDataHtml = (exifData: object) =>
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
