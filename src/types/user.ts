import { TPlanID } from "./plan";

export type IUserInfo = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date|null;
  plan: TPlanID;
  planActive: boolean;
  planStartDate: Date;
  flashcardSets: any[];
};

