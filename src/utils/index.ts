import { IKeyValue } from '../types';

type Reducible = any[] | IKeyValue;
type Value<I> = I extends any[] ? I[0] : I[keyof I];
type Key<I> = I extends any[] ? number : keyof I;

export const round = (value: number, decimalDigits = 0) => {
  const multiplier = Math.pow(10, decimalDigits);

  return Math.round(value * multiplier) / multiplier;
};

export const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const reduce = <I extends Reducible, O extends Reducible = I>(
  input: I,
  output?: O
) => <F extends (res: Reducible, value: Value<I>, key?: Key<I>) => void>(
  fn: F
) => {
  return ((input instanceof Array ? input : Object.keys(input)).reduce as any)(
    (res, key, index) => {
      if (input instanceof Array) {
        fn(res, key, index);
      } else {
        fn(res, input[key], key);
      }

      return res;
    },
    output || (input instanceof Array ? [] : {})
  );
};

export const map = <I extends Reducible, O extends Reducible = I>(
  input: I,
  output?: O
) => <F extends (value: Value<I>, key?: Key<I>) => any>(fn: F) => {
  return reduce(input, output || (input instanceof Array ? [] : {}))(
    (res, value, key) => {
      if (res instanceof Array) {
        res.push(fn(value, key));
      } else if (input instanceof Array) {
        res[value] = fn(value, key);
      } else {
        res[key] = fn(value, key);
      }
    }
  ) as O extends any[]
    ? Array<ReturnType<F>>
    : { [key: string]: ReturnType<F> };
};

export const each = (input: object | any[]) => (
  fn: (value: any, key?: any, isArray?: boolean) => any
) => reduce(input)((_, ...args) => fn(...args));

export const query = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) => selector && element.querySelectorAll(selector).forEach(fn);

export const querySelf = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) =>
  selector &&
  [
    ...Array.from(selector ? element.querySelectorAll(selector) : []),
    ...(element.matches(selector) ? [element] : []),
  ].forEach(fn);
