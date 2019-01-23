import { CssClasses } from '../../constants';
import { ExifProperties, IExifData, IExifDataProp } from '../../types';
import { Component } from '../../lib/component';
import { map } from '../../utils';

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

const mapProps = (exifData: IExifData) =>
  map(exifData, [])((value, name) => ({
    title: ExifProperties[name],
    value: formatValue((value as any).value, ExifProperties[
      name
    ] as ExifProperties),
  }));

export class Exif extends Component<{}, { data: IExifDataProp[] }> {
  protected template = `
    <div class="${CssClasses.PropertyList}">
      <div ex-repeat="data::prop">
        <div class="${CssClasses.PropertyName}" ex-html="prop.title"></div>
        <div class="${CssClasses.PropertyValue}" ex-html="prop.value"></div>
      </div>
    </div>
  `;

  constructor(root: HTMLElement, { data }) {
    super(root);

    this.updateScope({
      data: mapProps(data),
    });
  }
}

Component.register('exify-exif', Exif as any);
