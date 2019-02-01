import { Css, CheckboxIcon } from '../../constants';
import { ISettings } from '../../types';

const destroy = (dialog: HTMLDialogElement, next) => {
  dialog.classList.remove(Css.Show);
  dialog.addEventListener('transitionend', e => {
    if (e.propertyName === 'transform') {
      dialog.close();
      next();
    }
  });
};

export const toggleProp = (prop, element: HTMLElement) => {
  const checkbox = element.querySelector(`.${Css.Icon}`);

  prop.selected = !prop.selected;
  checkbox.innerHTML = prop.selected ? CheckboxIcon.On : CheckboxIcon.Off;
};

export const toggleEnabled = (scope, enabled: boolean) => {
  scope.enabled = enabled;
};

export const save = (
  scope,
  props: { settings: ISettings },
  dialog: HTMLDialogElement,
  next: (settings: ISettings) => void
) =>
  destroy(dialog, () => {
    const disabledDomains = props.settings.disabledDomains;
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
