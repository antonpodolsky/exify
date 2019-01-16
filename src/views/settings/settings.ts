import * as dialogPolyfill from 'dialog-polyfill';
import { CssClasses, CheckboxIcon, PropAttribute } from '../../constants';
import { createSettingsDialog } from './settings-renderer';
import { IUserSettings, OptionalExifProperties } from '../../types';

const destroy = (dialog: HTMLDialogElement) => {
  dialog.classList.remove(CssClasses.Show);
  dialog.addEventListener('transitionend', () => {
    dialog.close();
    dialog.remove();
  });
};

const initEvents = (dialog: HTMLDialogElement) =>
  new Promise<IUserSettings>((resolve, reject) =>
    dialog.addEventListener('click', ({ target }) =>
      [
        [
          CssClasses.SettingsProperty,
          (element: HTMLElement) => {
            const checkbox = element.querySelector(`.${CssClasses.Icon}`);

            checkbox.innerHTML =
              checkbox.innerHTML === CheckboxIcon.Off
                ? CheckboxIcon.On
                : CheckboxIcon.Off;
          },
        ],
        [
          CssClasses.SettingsSave,
          () => {
            resolve({
              optionalExifProperties: Array.from(
                dialog.querySelectorAll(`.${CssClasses.Icon}`)
              )
                .filter(checkbox => checkbox.innerHTML === CheckboxIcon.On)
                .map(e => e.getAttribute(PropAttribute)),
            });

            destroy(dialog);
          },
        ],
        [
          CssClasses.SettingsCancel,
          () => {
            reject();
            destroy(dialog);
          },
        ],
      ].forEach(([className, action]: any) => {
        const element = (target as HTMLElement).closest(`.${className}`);
        return element && action(element);
      })
    )
  );

const getOptionalExifProps = (exifData: object, userSettings: IUserSettings) =>
  Object.keys(OptionalExifProperties).reduce((res, prop) => {
    res[prop] = {
      value: exifData[prop],
      selected: userSettings.optionalExifProperties.indexOf(prop) !== -1,
    };
    return res;
  }, {});

export class Settings {
  constructor(private document: Document) {}

  private attach(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    this.document.body.appendChild(dialog).showModal();
    dialog.classList.add(CssClasses.Show);

    return initEvents(dialog);
  }

  public showSettings(exifData: object, userSettings: IUserSettings) {
    return this.attach(
      createSettingsDialog(
        this.document,
        getOptionalExifProps(exifData, userSettings)
      )
    );
  }
}
