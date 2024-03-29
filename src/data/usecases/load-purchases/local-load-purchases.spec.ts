import { LocalLoadPurchases } from "@/data/usecases";
import {
  CacheStoreSpy,
  mockPurchases,
  getCacheExpirationDate,
} from "@/data/tests";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();

  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalLoadPurchases", () => {
  test("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  test("Should return an empty list if load fails", async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(purchases).toEqual([]);
  });

  test("Should call return a list of purchases if cache is valid", async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { sut, cacheStore } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });

  test("Should call return an empty list of purchases if cache is expired", async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() - 1);
    const { sut, cacheStore } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  test("Should call return an empty list of purchases if cache on expiration date", async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    const { sut, cacheStore } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  test("Should call return an empty list of purchases if cache is empty", async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { sut, cacheStore } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: [],
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
});
