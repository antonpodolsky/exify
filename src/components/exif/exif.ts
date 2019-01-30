import { CssClasses } from '../../constants';
import { IExifDataProp } from '../../types';
import { Component } from '../../lib/component';

export class Exif extends Component<
  { data: IExifDataProp[] },
  { data: IExifDataProp[] }
> {
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
      data,
    });
  }
}

Component.register('exify-exif', Exif as any);
