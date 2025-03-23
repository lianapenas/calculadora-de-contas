
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import AddAccountModal from '@/components/AddAccountModal';
import AccountCard from '@/components/AccountCard';
import { Card, CardContent } from '@/components/ui/card';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, Search } from 'lucide-react';

const Accounts = () => {
  const { accounts, getTotalAccounts } = useAppStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  
  const { total, paid, pending } = getTotalAccounts();
  
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = 
        tab === 'all' || 
        (tab === 'pending' && !account.paid) || 
        (tab === 'paid' && account.paid);
      
      return matchesSearch && matchesFilter;
    });
  }, [accounts, search, tab]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen pb-24 pt-6 md:pb-6 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <AddAccountModal />
        </div>
        
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="glass-card animate-fade-in">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{formatCurrency(total)}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Pendente</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(pending)}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Pago</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(paid)}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar contas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background/50 pl-9"
            />
          </div>
          
          <Tabs value={tab} onValueChange={setTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                Todas
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pendentes
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-xs">
                Pagas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredAccounts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts
              .sort((a, b) => {
                // Sort by due date for pending accounts
                if (!a.paid && !b.paid) {
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                }
                // Pending accounts first, then sort paid accounts by most recently paid
                return a.paid === b.paid ? 0 : a.paid ? 1 : -1;
              })
              .map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
          </div>
        ) : (
          <div className="glass-card flex h-64 items-center justify-center rounded-xl p-4">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium">Nenhuma conta encontrada</p>
              <p className="text-muted-foreground">
                {search ? 'Tente mudar sua busca ou filtros' : 'Adicione sua primeira conta clicando no botão acima'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Header />
    </div>
  );
};

export default Accounts;
