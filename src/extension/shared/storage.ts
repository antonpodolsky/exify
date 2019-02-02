import { IStorage } from '../../types';
import { StorageKey } from '../../constants';

export class Storage<T> implements IStorage<T> {
  constructor(private browser: typeof chrome) {}

  public async get() {
    return new Promise<T>(resolve =>
      this.browser.storage.local.get([StorageKey], res =>
        resolve(res[StorageKey])
      )
    );
  }

  public save(obj: T) {
    return new Promise<T>(resolve =>
      this.browser.storage.local.set({ [StorageKey]: obj }, resolve)
    );
  }
}
