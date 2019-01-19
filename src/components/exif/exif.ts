import { CssClasses } from '../../constants';
import { ExifProperties, IExifData, IExifDataProp } from '../../types';
import { Component } from '../../lib/component';

export const formatValue = (value: any, prop: ExifProperties) => {
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

const mapProps = (exifData: IExifData): IExifDataProp[] =>
  Object.keys(exifData).map(name => ({
    ...exifData[name],
    name,
    title: ExifProperties[name],
    value: formatValue(exifData[name].value, ExifProperties[name]),
  }));

export class Exif extends Component {
  protected template = `
    <div class="${CssClasses.PropertyList}">
      <div ex-repeat="props::prop">
        <div class="${CssClasses.PropertyName}" ex-html="prop.title"></div>
        <div class="${CssClasses.PropertyValue}" ex-html="prop.value"></div>
      </div>
    </div>
  `;

  public show(exifData: IExifData) {
    this.scope = {
      props: mapProps(exifData),
    };

    this.render();
  }
}
