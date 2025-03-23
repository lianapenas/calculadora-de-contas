
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Account, Expense, DEFAULT_CATEGORIES, Category, CategoryStatistic } from "./types";
import { nanoid } from "nanoid";

interface AppState {
  accounts: Account[];
  expenses: Expense[];
  categories: Category[];
  
  // Account actions
  addAccount: (account: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  toggleAccountPaid: (id: string) => void;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Stats
  getTotalAccounts: () => { total: number; paid: number; pending: number };
  getTotalExpenses: () => number;
  getExpensesByCategory: () => CategoryStatistic[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      accounts: [],
      expenses: [],
      categories: DEFAULT_CATEGORIES,

      // Account actions
      addAccount: (account) => 
        set((state) => ({
          accounts: [
            ...state.accounts,
            { ...account, id: nanoid(), createdAt: new Date() },
          ],
        })),
      updateAccount: (id, updatedAccount) => 
        set((state) => ({
          accounts: state.accounts.map((account) => 
            account.id === id ? { ...account, ...updatedAccount } : account
          ),
        })),
      deleteAccount: (id) => 
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
        })),
      toggleAccountPaid: (id) => 
        set((state) => ({
          accounts: state.accounts.map((account) => 
            account.id === id ? { ...account, paid: !account.paid } : account
          ),
        })),

      // Expense actions
      addExpense: (expense) => 
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: nanoid(), createdAt: new Date() },
          ],
        })),
      updateExpense: (id, updatedExpense) => 
        set((state) => ({
          expenses: state.expenses.map((expense) => 
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        })),
      deleteExpense: (id) => 
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      // Category actions
      addCategory: (category) => 
        set((state) => ({
          categories: [...state.categories, { ...category, id: nanoid() }],
        })),
      updateCategory: (id, updatedCategory) => 
        set((state) => ({
          categories: state.categories.map((category) => 
            category.id === id ? { ...category, ...updatedCategory } : category
          ),
        })),
      deleteCategory: (id) => 
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),

      // Stats
      getTotalAccounts: () => {
        const accounts = get().accounts;
        const total = accounts.reduce((sum, account) => sum + account.amount, 0);
        const paid = accounts
          .filter((account) => account.paid)
          .reduce((sum, account) => sum + account.amount, 0);
        return { total, paid, pending: total - paid };
      },
      getTotalExpenses: () => {
        return get().expenses.reduce((sum, expense) => sum + expense.amount, 0);
      },
      getExpensesByCategory: () => {
        const expenses = get().expenses;
        const categories = get().categories;
        
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const statsByCategory: Record<string, { amount: number; category: string }> = {};
        
        // Sum expenses by category
        expenses.forEach((expense) => {
          if (!statsByCategory[expense.category]) {
            statsByCategory[expense.category] = { amount: 0, category: expense.category };
          }
          statsByCategory[expense.category].amount += expense.amount;
        });
        
        // Convert to array and add percentage
        return Object.values(statsByCategory).map((stat) => {
          const categoryObj = categories.find((c) => c.name === stat.category);
          return {
            category: stat.category,
            amount: stat.amount,
            color: categoryObj?.color || "#607D8B",
            percentage: totalAmount ? Math.round((stat.amount / totalAmount) * 100) : 0,
          };
        }).sort((a, b) => b.amount - a.amount);
      },
    }),
    {
      name: "pocket-organizer-storage",
    }
  )
);
