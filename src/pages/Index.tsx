
import { useAppStore } from '@/lib/store';
import { CreditCard, BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ExpenseChart from '@/components/ExpenseChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Index = () => {
  const { getTotalAccounts, getTotalExpenses, getExpensesByCategory, accounts, expenses } = useAppStore();
  
  const { total: totalAccounts, paid: paidAccounts, pending: pendingAccounts } = getTotalAccounts();
  const totalExpenses = getTotalExpenses();
  const expenseStats = getExpensesByCategory();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen pb-24 pt-6 md:pb-6 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/accounts" className="animate-fade-in">
            <Card className="glass-card overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Total de Contas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(totalAccounts)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-500">{formatCurrency(paidAccounts)}</span> pago ・
                      <span className="text-red-400"> {formatCurrency(pendingAccounts)}</span> pendente
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <CreditCard size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/expenses" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="glass-card overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Total de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                    <div className="text-xs text-muted-foreground">
                      {expenses.length} transações registradas
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/analysis" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="glass-card overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Análise de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {expenseStats.length > 0 
                        ? expenseStats[0].category 
                        : "Sem dados"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {expenseStats.length > 0 
                        ? `Maior categoria de gastos (${expenseStats[0].percentage}%)` 
                        : "Adicione gastos para ver análises"}
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <BarChart3 size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="animate-slide-in-up space-y-4" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Contas Recentes</h2>
              <Link to="/accounts" className="flex items-center text-sm text-primary">
                Ver todas
                <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            
            {accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 3)
                  .map((account) => (
                    <div key={account.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <p className="text-lg font-bold">
                          {formatCurrency(account.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="glass-card flex h-32 items-center justify-center rounded-xl p-4">
                <p className="text-muted-foreground">Nenhuma conta registrada ainda</p>
              </div>
            )}
          </div>
          
          <div className="animate-slide-in-up space-y-4" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Análise de Gastos</h2>
              <Link to="/analysis" className="flex items-center text-sm text-primary">
                Ver detalhes
                <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <ExpenseChart />
          </div>
        </div>
      </div>
      
      <Header />
    </div>
  );
};

export default Index;
