import { Css } from '../../css';
import { IExifDataProp } from '../../types';
import { Component } from '../../lib/component';

import './exif.scss';

export class Exif extends Component<
  { data: IExifDataProp[]; size: string },
  { data: IExifDataProp[]; size: string }
> {
  protected template = `
    <div class="${Css.PropertyList}">
      <div ex-repeat="data::prop">
        <div class="${
          Css.PropertyName
        }" ex-if="size === 'default'" ex-html="prop.title"></div>
        <div class="${Css.PropertyValue} ${Css.Align}">
          <span ex-if="prop.isHtml">
            <span ex-bind-html="prop.value === null ? '--' : prop.value"></span>
          </span>

          <span ex-if="!prop.isHtml">
            <span ex-html="prop.value === null ? '--' : prop.value"></span>
          </span>
        </div>
      </div>
    </div>
  `;

  constructor(root: HTMLElement, { data, size }) {
    super(root);

    this.updateScope({
      data,
      size,
    });
  }
}

Component.register('exify-exif', Exif as any);
