import { each, query, querySelf, reduce } from '../utils';
import { camelCase } from 'change-case';

export const compile = <E extends HTMLElement>(
  elementOrTemplate: string | E,
  registry = {}
) => scope => {
  const element = resolveElement(elementOrTemplate) as E;

  repeat(element, scope);
  condition(element, scope);
  component(element, scope, registry);
  html(element, scope);
  bindHtml(element, scope);
  cssClass(element, scope);
  attribute(element, scope);
  events(element, scope);

  return element;
};

const resolveElement = (elementOrTemplate: HTMLElement | string) => {
  let element;

  if (typeof elementOrTemplate === 'string') {
    const template = document.createElement('template');
    template.innerHTML = elementOrTemplate.trim();
    element = template.content.firstChild as HTMLElement;
  } else {
    element = elementOrTemplate;
  }

  return element;
};

const eachAttr = (element: HTMLElement, attr: string, matchSelf = true) => (
  fn: (el: HTMLElement, value: string, attr: string) => void
) =>
  (matchSelf ? querySelf : query)(element, `[${attr}]`)(el => {
    fn(el, el.getAttribute(attr), attr);
    el.removeAttribute(attr);
  });

const repeat = (element: HTMLElement, scope: object) =>
  eachAttr(element, 'ex-repeat', false)((el, value) => {
    const [itemsAlias, itemAlias] = value.split('::');

    each(scope[itemsAlias])(val =>
      el.parentElement.appendChild(
        compile(el.cloneNode(true) as HTMLElement)({
          ...scope,
          [itemAlias]: val,
        })
      )
    );

    el.remove();
  });

const condition = (element: HTMLElement, scope: object) =>
  eachAttr(element, 'ex-if')(
    (el, value) => !evalInScope(value, scope) && el.remove()
  );

const component = (element: HTMLElement, scope: object, registry: object) =>
  querySelf(element, Object.keys(registry).join(','))(
    el =>
      new registry[(el.tagName.toLowerCase())](
        el,
        reduce(Array.from(el.attributes))(
          (res, { name, value }) =>
            (res[camelCase(name)] = evalInScope(value, scope))
        )
      )
  );

const html = (element: HTMLElement, scope: object) =>
  eachAttr(element, 'ex-html')(
    (el, value) => (el.innerHTML = escapeHTML(evalInScope(value, scope)))
  );

const bindHtml = (element: HTMLElement, scope: object) =>
  eachAttr(element, 'ex-bind-html')(
    (el, value) => (el.innerHTML = evalInScope(value, scope))
  );

const cssClass = (element: HTMLElement, scope: object) =>
  eachAttr(element, 'ex-class')((el, value) =>
    el.classList.add(evalInScope(value, scope))
  );

const attribute = (element: HTMLElement, scope: object) =>
  ['checked'].forEach(attr =>
    eachAttr(element, `ex-attr-${attr}`)(
      (el, value) => evalInScope(value, scope) && el.setAttribute(attr, attr)
    )
  );

const events = (element: HTMLElement, scope: object) =>
  ['click'].forEach(type =>
    eachAttr(element, `ex-${type}`)((el, value) =>
      el.addEventListener(type, () =>
        evalInScope(value, { ...scope, $element: el })
      )
    )
  );

const evalInScope = (expression: string, scope: object) =>
  (() => {
    // tslint:disable-next-line:no-eval
    return eval(
      Object.keys(scope).reduce(
        (res, key) =>
          res.replace(
            new RegExp(
              '\\$?\\b' + escapeRegex(key.replace('$', '')) + '\\b',
              'g'
            ),
            `this.${key}`
          ),
        expression
      )
    );
  }).call(scope);

const escapeHTML = (value: any) =>
  ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const escapeRegex = (value: any) => ('' + value).replace(/\$/g, '\\$');
