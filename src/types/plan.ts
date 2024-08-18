export type TPlanID = "free" | "basic" | "standard" | "premium";
export type TPlan = {
  id: TPlanID;
  title: string;
  monthly_price: number;
  yearly_price: number;
  description: string;
  features: string[];
};
