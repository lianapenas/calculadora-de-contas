
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import AddExpenseModal from '@/components/AddExpenseModal';
import ExpenseCard from '@/components/ExpenseCard';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TrendingUp, Search } from 'lucide-react';

const Expenses = () => {
  const { expenses, getTotalExpenses, categories } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const totalExpenses = getTotalExpenses();
  
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);
  
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
          <h1 className="text-3xl font-bold tracking-tight">Gastos</h1>
          <AddExpenseModal />
        </div>
        
        <div className="mb-6">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Gastos</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-border"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Gastos Registrados</p>
                  <p className="text-2xl font-bold">{expenses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar gastos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background/50 pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-background/50 w-full md:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredExpenses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
          </div>
        ) : (
          <div className="glass-card flex h-64 items-center justify-center rounded-xl p-4">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium">Nenhum gasto encontrado</p>
              <p className="text-muted-foreground">
                {search || categoryFilter !== 'all' 
                  ? 'Tente mudar sua busca ou filtros' 
                  : 'Adicione seu primeiro gasto clicando no botão acima'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Header />
    </div>
  );
};

export default Expenses;
