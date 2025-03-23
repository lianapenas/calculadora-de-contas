
export interface Account {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  paid: boolean;
  createdAt: Date;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
  createdAt: Date;
}

export type Category = {
  id: string;
  name: string;
  color: string;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Alimentação", color: "#FF6B6B" },
  { id: "2", name: "Transporte", color: "#4ECDC4" },
  { id: "3", name: "Moradia", color: "#F9C80E" },
  { id: "4", name: "Lazer", color: "#7A5CF0" },
  { id: "5", name: "Saúde", color: "#45B8AC" },
  { id: "6", name: "Educação", color: "#D65DB1" },
  { id: "7", name: "Outros", color: "#607D8B" },
];

export type CategoryStatistic = {
  category: string;
  amount: number;
  color: string;
  percentage: number;
};
