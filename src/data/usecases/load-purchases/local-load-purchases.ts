import { ICacheStore } from "@/data/protocols/cache";
import { SavePurchases, ISavePurchases } from "@/domain/usecases";

export class LocalLoadPurchases implements ISavePurchases {
  private readonly key = "purchases";

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete(this.key);
    this.cacheStore.insert(this.key, {
      timestamp: this.timestamp,
      value: purchases,
    });
  }

  async loadAll(): Promise<void> {
    this.cacheStore.fetch(this.key);
  }
}
