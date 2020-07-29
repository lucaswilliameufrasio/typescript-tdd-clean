import { ICacheStore } from "../protocols/cache";
import { SavePurchases } from "@/domain/usecases";

const maxAgeInDays = 3;

export const getCacheExpirationDate = (timestamp: Date): Date => {
  const maxCacheAge = new Date(timestamp);

  maxCacheAge.setDate(maxCacheAge.getDate() - maxAgeInDays);

  return maxCacheAge;
};

export class CacheStoreSpy implements ICacheStore {
  actions: Array<CacheStoreSpy.Action> = [];
  deleteKey: string;
  insertKey: string;
  fetchKey: string;
  insertValues: Array<SavePurchases.Params> = [];
  fetchResult: any;

  fetch(key): any {
    this.actions.push(CacheStoreSpy.Action.fetch);
    this.fetchKey = key;

    return this.fetchResult;
  }

  delete(key): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "fetch").mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.fetch);
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete);
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert);

      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert,
    fetch,
  }
}
