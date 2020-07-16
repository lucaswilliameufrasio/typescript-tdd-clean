import { ICacheStore } from "@/data/protocols/cache";
import { SavePurchases, ISavePurchases } from "@/domain/usecases";

export class LocalSavePurchases implements ISavePurchases {
  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases", {
      timestamp: this.timestamp,
      value: purchases,
    });
  }
}
