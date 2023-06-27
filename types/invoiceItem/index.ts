/* Recent Transaction */
type invoiceItem = {
  id?: string;
  invoiceId?: number;
  description?: string;
  quantity?: number|null;
  weight?: number|null;
  fee?: number|null;
};

export type { invoiceItem }
