import * as dialogPolyfill from 'dialog-polyfill';
import { Css, CheckboxIcon } from '../../constants';
import * as Events from './settings-events';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import {
  ISettings,
  OptionalExifProperties,
  IExifDataProp,
  IExifData,
} from '../../types';

interface IProps {
  settings: ISettings;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
}

const getOptionalExifProps = (exifData: IExifData, settings: ISettings) =>
  map(OptionalExifProperties, [])((_, prop) => ({
    ...exifData[prop],
    selected: settings.optionalExifProperties.indexOf(prop) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = `
    <dialog class="${Css.Settings}">
      <div class="${Css.SpaceV} ${Css.X2} ${Css.Border}">
        <div class="${Css.SettingsHeader} ${Css.Row} ${Css.Align} ${
    Css.SpaceH
  }">
          <div class="${Css.Logo}"></div>
          <span>EXIFY Settings</span>
        </div>

        <div class="${Css.SettingsContent} ${Css.SpaceV} ${Css.Border} ${
    Css.X2
  }">
          <div class="${Css.Row} ${Css.Align} ${Css.SpaceH} ${Css.X2}">
            <div>Toggle for this site</div>
            <exify-switch on="enabled" on-change="toggleEnabled"></exify-switch>
          </div>

          <div class="${Css.Row} ${Css.SpaceH} ${Css.X2}">
            <div>Additional properties</div>
            <div class="${Css.SpaceV} ${Css.X2}">
              <div 
                class="${Css.Row} ${Css.Align} ${Css.Pointer} ${Css.SpaceH}" 
                ex-repeat="props::prop" 
                ex-click="toggleProp(prop, $element)"
              >
                <span class="${Css.Icon}" ex-html="prop.selected ? '${
    CheckboxIcon.On
  }' : '${CheckboxIcon.Off}'"></span>
                <div>
                  <div class="${Css.PropertyName}" ex-html="prop.title"></div>
                  <div class="${Css.PropertyValue}" ex-html="prop.value"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="${Css.SettingsFooter} ${Css.Row} ${Css.Center} ${
    Css.SpaceH
  }">
          <div 
           class="${Css.Button}"
            ex-click="cancel()"
          >Cancel</div>
          <div class="${Css.Button}" ex-click="save()">Save</div>
        </div>
      </div>
    </dialog>  
  `;

  constructor(root: HTMLElement) {
    super(root);
  }

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    dialog.showModal();
    dialog.classList.add(Css.Show);
  }

  public show(exifData: IExifData, settings: ISettings) {
    this.props = { settings };

    return new Promise<ISettings>((resolve, reject) => {
      this.events = {
        save: () => Events.save(this.scope, this.props, this.element, resolve),
        cancel: () => Events.cancel(this.element, reject),
        toggleEnabled: enabled => Events.toggleEnabled(this.scope, enabled),
        toggleProp: (prop, element) => Events.toggleProp(prop, element),
      };

      this.updateScope({
        props: getOptionalExifProps(exifData, settings),
        enabled:
          settings.disabledDomains.indexOf(document.location.hostname) === -1,
      });
    }).finally(() => this.destroy());
  }
}
