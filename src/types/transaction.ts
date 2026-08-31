export type TxCategory =
  | "Monthly Fee"
  | "Personal Training"
  | "Registration"
  | "Locker";

export type TxMethod = "Credit Card" | "Apple Pay" | "Cash" | "Bank Transfer";

export interface Tx {
  id: string;
  invoiceNumber: string;
  memberName: string;
  initials: string;
  tier: string;
  amount: number;
  category: TxCategory;
  method: TxMethod;
  date: string;
}

export const MOCK_TRANSACTIONS: Tx[] = [
  {
    id: "1",
    invoiceNumber: "INV-2041",
    memberName: "Sarah Johnson",
    initials: "SJ",
    tier: "Premium",
    amount: 99,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 14",
  },
  {
    id: "2",
    invoiceNumber: "INV-2040",
    memberName: "Mike Chen",
    initials: "MC",
    tier: "Basic",
    amount: 40,
    category: "Monthly Fee",
    method: "Apple Pay",
    date: "Mar 13",
  },
  {
    id: "3",
    invoiceNumber: "INV-2039",
    memberName: "Emma Davis",
    initials: "ED",
    tier: "Premium",
    amount: 80,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 12",
  },
  {
    id: "4",
    invoiceNumber: "INV-2038",
    memberName: "David Kim",
    initials: "DK",
    tier: "VIP",
    amount: 149,
    category: "Monthly Fee",
    method: "Bank Transfer",
    date: "Mar 11",
  },
  {
    id: "5",
    invoiceNumber: "INV-2037",
    memberName: "Olivia Brown",
    initials: "OB",
    tier: "Premium",
    amount: -20,
    category: "Locker",
    method: "Cash",
    date: "Mar 10",
  },
  {
    id: "6",
    invoiceNumber: "INV-2036",
    memberName: "Liam Wilson",
    initials: "LW",
    tier: "Basic",
    amount: 40,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 09",
  },
];

export const CATEGORIES: TxCategory[] = [
  "Monthly Fee",
  "Personal Training",
  "Registration",
  "Locker",
];

export const METHODS: TxMethod[] = [
  "Credit Card",
  "Apple Pay",
  "Cash",
  "Bank Transfer",
];

export function getTransactionById(id: string): Tx | undefined {
  return MOCK_TRANSACTIONS.find((t) => t.id === id);
}
