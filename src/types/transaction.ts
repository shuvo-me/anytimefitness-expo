export type TxCategory =
  | "Monthly Fee"
  | "Yearly Fee"
  | "Admission Fee";


export type TxMethod = "Cash" | "bKash";

export type MembershipTier = "Monthly" | "Yearly";

export interface Tx {
  id: string;
  memberId: string;
  invoiceNumber: string;
  memberName: string;
  initials: string;
  tier: MembershipTier;
  amount: number;
  category: TxCategory;
  method: TxMethod;
  date: string;
}

export const TIER_PRICE: Record<MembershipTier, number> = {
  Monthly: 600,
  Yearly: 7000,
};

export const CATEGORIES: TxCategory[] = [
  "Monthly Fee",
  "Yearly Fee",
  "Admission Fee",
];

export const METHODS: TxMethod[] = [
  "Cash",
  "bKash",
]
