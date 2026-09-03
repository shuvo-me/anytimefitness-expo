export type TxCategory =
  | "Monthly Fee"
  | "Personal Training"
  | "Registration"
  | "Locker";

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

export const MOCK_TRANSACTIONS: Tx[] = [
  {
    id: "1",
    memberId: "",
    invoiceNumber: "INV-2041",
    memberName: "Sarah Johnson",
    initials: "SJ",
    tier: "Yearly",
    amount: 99,
    category: "Monthly Fee",
    method: "bKash",
    date: "Mar 14",
  },
  {
    id: "2",
    memberId: "",
    invoiceNumber: "INV-2040",
    memberName: "Mike Chen",
    initials: "MC",
    tier: "Monthly",
    amount: 40,
    category: "Monthly Fee",
    method: "bKash",
    date: "Mar 13",
  },
  {
    id: "3",
    memberId: "",
    invoiceNumber: "INV-2039",
    memberName: "Emma Davis",
    initials: "ED",
    tier: "Yearly",
    amount: 80,
    category: "Monthly Fee",
    method: "Cash",
    date: "Mar 12",
  },
  {
    id: "4",
    memberId: "",
    invoiceNumber: "INV-2038",
    memberName: "David Kim",
    initials: "DK",
    tier: "Yearly",
    amount: 149,
    category: "Monthly Fee",
    method: "bKash",
    date: "Mar 11",
  },
  {
    id: "5",
    memberId: "",
    invoiceNumber: "INV-2037",
    memberName: "Olivia Brown",
    initials: "OB",
    tier: "Yearly",
    amount: -20,
    category: "Locker",
    method: "Cash",
    date: "Mar 10",
  },
  {
    id: "6",
    memberId: "",
    invoiceNumber: "INV-2036",
    memberName: "Liam Wilson",
    initials: "LW",
    tier: "Monthly",
    amount: 40,
    category: "Monthly Fee",
    method: "Cash",
    date: "Mar 09",
  },
];

export const TIER_PRICE: Record<MembershipTier, number> = {
  Monthly: 600,
  Yearly: 7000,
};

export const CATEGORIES: TxCategory[] = [
  "Monthly Fee",
  "Personal Training",
  "Registration",
  "Locker",
];

export const METHODS: TxMethod[] = [
  "Cash",
  "bKash",
];

export function getTransactionById(id: string): Tx | undefined {
  return MOCK_TRANSACTIONS.find((t) => t.id === id);
}
