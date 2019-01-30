import * as dialogPolyfill from 'dialog-polyfill';
import { CssClasses, CheckboxIcon } from '../../constants';
import * as Events from './settings-events';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import {
  IUserSettings,
  OptionalExifProperties,
  IExifDataProp,
  IExifData,
} from '../../types';

interface IProps {
  userSettings: IUserSettings;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
}

const getOptionalExifProps = (
  exifData: IExifData,
  userSettings: IUserSettings
) =>
  map(OptionalExifProperties, [])((_, prop) => ({
    ...exifData[prop],
    selected: userSettings.optionalExifProperties.indexOf(prop) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = `
    <dialog class="${CssClasses.Settings}">
      <div>
        <div class="${CssClasses.SettingsHeader}">
          <div>
            <div class="${CssClasses.Logo}"></div>
            <span>Additional EXIF properties</span>
          </div>  

          <exify-switch on="enabled" on-change="toggleEnabled"></exify-switch>
        </div>
        <div class="${CssClasses.SettingsContent}">
          <div class="${
            CssClasses.SettingsProperty
          }" ex-repeat="props::prop" ex-click="toggleProp(prop, $element)">
            <span class="${CssClasses.Icon}" ex-html="prop.selected ? '${
    CheckboxIcon.On
  }' : '${CheckboxIcon.Off}'"></span>
            <div>
              <div class="${
                CssClasses.PropertyName
              }" ex-html="prop.title"></div>
              <div class="${
                CssClasses.PropertyValue
              }" ex-html="prop.value"></div>
            </div>
          </div>
        </div>
        <div class="${CssClasses.SettingsFooter}">
          <div class="${CssClasses.SettingsSave}" ex-click="save()">Save</div>
          <div 
            class="${CssClasses.SettingsCancel}"
            ex-click="cancel()"
          >Cancel</div>
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
    dialog.classList.add(CssClasses.Show);
  }

  public show(exifData: IExifData, userSettings: IUserSettings) {
    this.props = { userSettings };

    return new Promise<IUserSettings>((resolve, reject) => {
      this.events = {
        save: () => Events.save(this.scope, this.props, this.element, resolve),
        cancel: () => Events.cancel(this.element, reject),
        toggleEnabled: enabled => Events.toggleEnabled(this.scope, enabled),
        toggleProp: (prop, element) => Events.toggleProp(prop, element),
      };

      this.updateScope({
        props: getOptionalExifProps(exifData, userSettings),
        enabled:
          userSettings.disabledDomains.indexOf(document.location.hostname) ===
          -1,
      });
    }).finally(() => this.destroy());
  }
}
