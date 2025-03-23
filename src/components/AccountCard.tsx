
import { useState } from 'react';
import { Account } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleAccountPaid, deleteAccount } = useAppStore();
  
  const handleTogglePaid = () => {
    toggleAccountPaid(account.id);
    toast.success(account.paid ? 'Conta marcada como pendente' : 'Conta marcada como paga');
  };
  
  const handleDelete = () => {
    if (isDeleting) {
      deleteAccount(account.id);
      toast.success('Conta removida com sucesso');
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
  
  const isOverdue = !account.paid && new Date(account.dueDate) < new Date();
  
  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden rounded-xl p-4 transition-all duration-300 animate-scale-in",
        account.paid ? "opacity-70" : "opacity-100",
        isOverdue ? "border-destructive/30" : ""
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className={cn(
            "font-medium transition-all",
            account.paid && "line-through text-muted-foreground"
          )}>
            {account.name}
          </h3>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(account.amount)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Vencimento: {format(new Date(account.dueDate), 'dd MMM yyyy', { locale: ptBR })}</span>
            {isOverdue && !account.paid && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                Atrasada
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleTogglePaid}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              account.paid
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            <Check size={16} />
          </button>
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
        className="absolute bottom-0 left-0 h-1 bg-primary"
        style={{ 
          width: account.paid ? '100%' : '0%',
          transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10" 
      />
    </div>
  );
};

export default AccountCard;
