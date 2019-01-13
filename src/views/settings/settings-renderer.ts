import { CssClasses, PropAttribute, CheckboxIcon } from '../../constants';
import { getExifHtml } from '../exif/exif-renderer';
import { escapeHTML } from '../../utils';
import { IExifData } from '../../types';

const getSettingsHtml = (exifData: IExifData) => `
  <div>
    <div class="${CssClasses.SettingsHeader}">
      <div class="${CssClasses.Logo}"></div>
      Additional EXIF properties
    </div>
    <div class="${CssClasses.SettingsContent}">${getExifHtml(
  exifData,
  (propHtml, prop) => `
      <div class="${CssClasses.SettingsProperty}">
        <span class="${CssClasses.Icon}" ${PropAttribute}="${escapeHTML(
    prop.name
  )}">${prop.selected ? CheckboxIcon.On : CheckboxIcon.Off}</span>
        ${propHtml}
      </div>
`
)}</div>
    <div class="${CssClasses.SettingsFooter}">
      <button class="${CssClasses.SettingsSave}">Save</button>
      <button class="${CssClasses.SettingsCancel}">Cancel</button>
    </div>
  </div>
`;

export const createSettingsDialog = (
  document: Document,
  exifData: IExifData
) => {
  const dialog = document.createElement('dialog');

  dialog.innerHTML = getSettingsHtml(exifData);
  dialog.classList.add(CssClasses.Settings);

  return dialog;
};
