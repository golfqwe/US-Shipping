/* Recent Transaction */
type payment = {
  id?: number;
  invoiceId?: number;
  bankId?: number|null;
  amount?: number|null;
  payDate?: string|null;
  slipImage?: any|[];
  status?: string|boolean;
};

export type { payment }
