import { Css } from '../../constants';
import { IExifDataProp } from '../../types';
import { Component } from '../../lib/component';

import './exif.scss';

export class Exif extends Component<
  { data: IExifDataProp[] },
  { data: IExifDataProp[] }
> {
  protected template = `
    <div class="${Css.PropertyList}">
      <div ex-repeat="data::prop">
        <div class="${Css.PropertyName}" ex-html="prop.title"></div>
        <div class="${Css.PropertyValue}" ex-html="prop.value"></div>
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
