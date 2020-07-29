import { ICacheStore } from "@/data/protocols/cache";
import {
  SavePurchases,
  ISavePurchases,
  ILoadPurchases,
  LoadPurchases,
} from "@/domain/usecases";

export class LocalLoadPurchases implements ISavePurchases, ILoadPurchases {
  private readonly key = "purchases";

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete(this.key);
    this.cacheStore.insert(this.key, {
      timestamp: this.currentDate,
      value: purchases,
    });
  }

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);

      return cache.value;
    } catch (error) {
      this.cacheStore.delete(this.key);
      
      return [];
    }
  }
}
