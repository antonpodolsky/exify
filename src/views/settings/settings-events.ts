import { CssClasses, CheckboxIcon, PropAttribute } from '../../constants';

const destroy = (dialog: HTMLDialogElement, next) => {
  dialog.classList.remove(CssClasses.Show);
  dialog.addEventListener('transitionend', () => {
    dialog.close();
    dialog.remove();
    next();
  });
};

export const toggle = (element: HTMLElement) => {
  const checkbox = element.querySelector(`.${CssClasses.Icon}`);

  checkbox.innerHTML =
    checkbox.innerHTML === CheckboxIcon.Off
      ? CheckboxIcon.On
      : CheckboxIcon.Off;
};

export const save = (dialog: HTMLDialogElement, next) =>
  destroy(dialog, () =>
    next({
      optionalExifProperties: Array.from(
        dialog.querySelectorAll(`.${CssClasses.Icon}`)
      )
        .filter(checkbox => checkbox.innerHTML === CheckboxIcon.On)
        .map(e => e.getAttribute(PropAttribute)),
    })
  );

export const cancel = (dialog: HTMLDialogElement, next) =>
  destroy(dialog, next);
