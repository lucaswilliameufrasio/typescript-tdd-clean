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
    private readonly timestamp: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete(this.key);
    this.cacheStore.insert(this.key, {
      timestamp: this.timestamp,
      value: purchases,
    });
  }

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      this.cacheStore.fetch(this.key);

      return [];
    } catch (error) {
      this.cacheStore.delete(this.key);
      
      return [];
    }
  }
}
