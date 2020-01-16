import { Css, CheckboxIcon } from '../markdown';
import { ISettings } from '../../types';

const destroy = (dialog: HTMLDialogElement, props, next) => {
  if (props.animate) {
    dialog.classList.remove(Css.Show);
    dialog.addEventListener('transitionend', e => {
      if (e.propertyName === 'transform') {
        dialog.close();
        next();
      }
    });
  } else {
    dialog.close();
    next();
  }
};

export const toggleProp = (prop, element: HTMLElement) => {
  const checkbox = element.querySelector(`.${Css.Icon}`);

  prop.selected = !prop.selected;
  checkbox.innerHTML = prop.selected ? CheckboxIcon.On : CheckboxIcon.Off;
};

export const toggleEnabled = (scope, enabled: boolean) => {
  scope.enabled = enabled;
};

export const toggleSiteFilterType = (scope, type: string) => {
  scope.siteFilterType = type;
};

export const toggleOverlayToggleType = (scope, type: string) => {
  scope.overlayToggleType = type;
};

export const toggleOverlaySize = (scope, size: string) => {
  scope.overlaySize = size;
};

export const save = (
  scope,
  props,
  dialog: HTMLDialogElement,
  next: (settings: ISettings) => void
) =>
  destroy(dialog, props, () => {
    next({
      optionalExifProperties: scope.props
        .filter(prop => prop.selected)
        .map(({ name }) => name),
      enabled: scope.enabled,
      siteFilterType: scope.siteFilterType,
      overlayToggleType: scope.overlayToggleType,
      overlaySize: scope.overlaySize,
    });
  });

export const cancel = (dialog: HTMLDialogElement, props, next) =>
  destroy(dialog, props, next);
