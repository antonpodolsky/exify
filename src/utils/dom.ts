export const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const query = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) => selector && element.querySelectorAll(selector).forEach(fn);

export const querySelf = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) =>
  selector &&
  [
    ...Array.from(element.querySelectorAll(selector)),
    ...(element.matches(selector) ? [element] : []),
  ].forEach(fn);
