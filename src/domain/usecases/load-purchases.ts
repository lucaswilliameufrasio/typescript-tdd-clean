import { PurchaseModel } from "@/domain/models";

export interface ILoadPurchases {
  loadAll: (purchases: Array<LoadPurchases.Result>) => Promise<void>;
}

export namespace LoadPurchases {
  export type Result = PurchaseModel;
}
