/* Recent Transaction */
type Product = {
  id?: string;
  carrierId?: number|null;
  wareHouseId?: number|null;
  trackingNumber?: string;
  website?: string;
  description?: string;
  carrier?: string;
  status?: boolean|string;
};

export type { Product }
