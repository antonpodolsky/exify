import 'dialog-polyfill/dialog-polyfill.css';
import * as dialogPolyfill from 'dialog-polyfill';
import { Css } from '../markdown';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { ISettings, IExifDataProp, IExifData } from '../../types';
import { OptionalExifProperties } from '../../config';

import template from './settings-template';
import * as Events from './settings-events';

import './settings.scss';

interface IProps {
  animate: boolean;
  settings: ISettings;
  exifData?: IExifData;
  fetchHistogram?(): void;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
  url: string;
  siteFilterType: string;
  siteFilterTypeOptions: Array<{
    title: string;
    value: string;
    description: string;
  }>;
  overlayToggleType: string;
  overlayToggleTypeOptions: Array<{
    title: string;
    value: string;
    description: string;
  }>;
  overlaySize: string;
  overlaySizeOptions: Array<{
    title: string;
    value: string;
    description: string;
  }>;
  fetchHistogram?(): void;
}

const getOptionalExifProps = (
  exifData: IExifData = {},
  optionalExifProperties: string[]
): IExifDataProp[] =>
  map(OptionalExifProperties, [])((title, name) => ({
    name,
    title,
    value: exifData[name] && exifData[name].value,
    isHtml: exifData[name] && exifData[name].isHtml,
    selected: optionalExifProperties.indexOf(name) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = template;

  constructor(root: HTMLElement, props) {
    super(root, props);
  }

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    if (this.props.animate) {
      dialog.showModal();
      dialog.classList.add(Css.Show);
    } else {
      dialog.classList.add(Css.Show);
      dialog.showModal();
    }
  }

  public show() {
    return new Promise<ISettings>((resolve, reject) => {
      const { exifData, settings, fetchHistogram } = this.props;

      this.events = {
        save: () => Events.save(this.scope, this.props, this.element, resolve),
        cancel: () => Events.cancel(this.element, this.props, reject),
        toggleEnabled: enabled => Events.toggleEnabled(this.scope, enabled),
        toggleProp: (prop, element) => Events.toggleProp(prop, element),
        toggleSiteFilterType: type =>
          Events.toggleSiteFilterType(this.scope, type),
        toggleOverlayToggleType: type =>
          Events.toggleOverlayToggleType(this.scope, type),
        toggleOverlaySize: size => Events.toggleOverlaySize(this.scope, size),
      };

      this.updateScope({
        props: getOptionalExifProps(exifData, settings.optionalExifProperties),
        enabled: settings.enabled,
        url: settings.url,
        siteFilterType: settings.siteFilterType,
        siteFilterTypeOptions: [
          {
            title: 'Enabled by default',
            value: 'blacklist',
            description: 'The overlay will be enabled by default on all sites',
          },
          {
            title: 'Disabled by default',
            value: 'whitelist',
            description: 'The overlay will be disabled by default on all sites',
          },
        ],
        overlayToggleType: settings.overlayToggleType,
        overlayToggleTypeOptions: [
          {
            title: 'Image hover',
            value: 'imageHover',
            description:
              'The overlay will be triggered by hovering over an image',
          },
          {
            title: 'Logo hover',
            value: 'logoHover',
            description:
              'The overlay will be triggered by hovering over the logo in the bottom right corner of an image',
          },
        ],
        overlaySize: settings.overlaySize,
        overlaySizeOptions: [
          {
            title: 'Default',
            value: 'default',
            description: 'Default overlay size',
          },
          {
            title: 'Compact',
            value: 'compact',
            description: 'Compact overlay size',
          },
        ],
        fetchHistogram,
      });
    }).finally(() => this.destroy());
  }
}
