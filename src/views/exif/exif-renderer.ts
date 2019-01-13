import { CssClasses } from '../../constants';
import { ExifProperties, IExifData, IExifDataProp } from '../../types';
import { escapeHTML } from '../../utils';

const formatValue = (value: any, prop: ExifProperties) => {
  if (typeof value === 'undefined') {
    return '--';
  }

  switch (prop) {
    case ExifProperties.FocalLength:
      return `${value}mm`;
    case ExifProperties.FNumber:
      return `f/${value}`;
    case ExifProperties.ExposureTime:
      return `${value}s`;
    case ExifProperties.ExposureBias:
      return value || 'Neutral';
    case ExifProperties.DateTimeOriginal:
      return (([date, hour]) => [
        date.replace(/\:/g, '/'),
        hour
          .split(':')
          .splice(0, 2)
          .join(':'),
      ])(value.split(' ')).join(' ');
    default:
      return value;
  }
};

const mapData = (exifData: IExifData): IExifDataProp[] =>
  Object.keys(exifData).map(name => ({
    ...exifData[name],
    name,
    title: ExifProperties[name],
    value: formatValue(exifData[name].value, ExifProperties[name]),
  }));

export const getExifHtml = (
  exifData: IExifData,
  transform: (propHtml: string, prop: IExifDataProp) => string = x => x
) =>
  mapData(exifData)
    .map(prop =>
      transform(
        `
        <div>
          <div class="${CssClasses.PropertyName}">${escapeHTML(
          prop.title
        )}</div>
          <div class="${CssClasses.PropertyValue}">${escapeHTML(
          prop.value
        )}</div>
        </div>
      `,
        prop
      )
    )
    .join('');

export const renderExif = (container: HTMLElement, exifData: IExifData) => {
  container.innerHTML = getExifHtml(exifData);
};
