import { CssClasses, CheckboxIcon } from '../../constants';
import { IUserSettings } from '../../types';

const destroy = (dialog: HTMLDialogElement, next) => {
  dialog.classList.remove(CssClasses.Show);
  dialog.addEventListener('transitionend', e => {
    if (e.propertyName === 'transform') {
      dialog.close();
      next();
    }
  });
};

export const toggleProp = (prop, element: HTMLElement) => {
  const checkbox = element.querySelector(`.${CssClasses.Icon}`);

  prop.selected = !prop.selected;
  checkbox.innerHTML = prop.selected ? CheckboxIcon.On : CheckboxIcon.Off;
};

export const toggleEnabled = (scope, enabled: boolean) => {
  scope.enabled = enabled;
};

export const save = (
  scope,
  props: { userSettings: IUserSettings },
  dialog: HTMLDialogElement,
  next: (userSettings: IUserSettings) => void
) =>
  destroy(dialog, () => {
    const disabledDomains = props.userSettings.disabledDomains;
    const domainIndex = disabledDomains.indexOf(document.location.hostname);

    if (scope.enabled && domainIndex !== -1) {
      disabledDomains.splice(domainIndex, 1);
    } else if (!scope.enabled && domainIndex === -1) {
      disabledDomains.push(document.location.hostname);
    }

    next({
      optionalExifProperties: scope.props
        .filter(prop => prop.selected)
        .map(({ name }) => name),
      disabledDomains,
    });
  });

export const cancel = (dialog: HTMLDialogElement, next) =>
  destroy(dialog, next);
