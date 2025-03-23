
import { useState } from 'react';
import { Expense } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteExpense, categories } = useAppStore();
  
  const handleDelete = () => {
    if (isDeleting) {
      deleteExpense(expense.id);
      toast.success('Gasto removido com sucesso');
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  const category = categories.find(c => c.name === expense.category);
  
  return (
    <div className="glass-card animate-scale-in overflow-hidden rounded-xl p-4 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{expense.name}</h3>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(expense.amount)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(new Date(expense.date), 'dd MMM yyyy', { locale: ptBR })}</span>
            {category && (
              <span 
                className="rounded-full px-2 py-0.5 text-xs font-medium" 
                style={{ 
                  backgroundColor: `${category.color}20`,
                  color: category.color 
                }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleDelete}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              isDeleting
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-1" 
        style={{ backgroundColor: category?.color || '#607D8B' }}
      />
    </div>
  );
};

export default ExpenseCard;
