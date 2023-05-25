/* Recent Transaction */
type tracking = {
  id?: string;
  userId?: number|null,
  carrierId?: number|null;
  wareHouseId?: number|null;
  trackingNumber?: string;
  website?: string;
  description?: string;
  carrier?: string;
  createdAt?: string;
  status?: boolean|string;
};

export type { tracking }
