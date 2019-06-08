interface IKeyValue<V = any> {
  [key: string]: V;
}

type Reducible = any[] | IKeyValue;
type Value<I> = I extends any[] ? I[0] : I[keyof I];
type Key<I> = I extends any[] ? number : keyof I;

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
