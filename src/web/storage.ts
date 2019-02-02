import { IStorage } from '../types';
import { StorageKey } from '../constants';

export class Storage<T> implements IStorage<T> {
  public get() {
    let res: T = null;

    try {
      res = JSON.parse(window.localStorage.getItem(StorageKey));
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }

    return Promise.resolve(res);
  }

  public save(obj: T) {
    return new Promise<T>(resolve => {
      window.localStorage.setItem(StorageKey, JSON.stringify(obj));

      resolve(obj);
    });
  }
}
