class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete("purchases");
  }
}

interface ICacheStore {
  delete: (key: string) => void;
}

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;
  key: string;

  delete(key): void {
    this.deleteCallsCount++;
    this.key = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();

  const sut = new LocalSavePurchases(cacheStore);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  test("Should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test("Should delete cache old cache on sut.save", async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe("purchases");
  });
});
