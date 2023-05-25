/* Recent Transaction */
type description = {
  id: number,
  description: string;
  quantity: number;
  weight: number|null;
  fee: number
};

export type { description }
