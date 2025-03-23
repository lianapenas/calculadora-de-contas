
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import ExpenseChart from '@/components/ExpenseChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isEqual, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Analysis = () => {
  const { expenses, getExpensesByCategory } = useAppStore();
  const categoriesStats = getExpensesByCategory();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  // Get current month data
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  
  // Create data for daily expenses chart
  const daysInMonth = eachDayOfInterval({ start, end }).map((date) => {
    const dayExpenses = expenses.filter((expense) => 
      isEqual(
        new Date(expense.date).setHours(0, 0, 0, 0),
        date.setHours(0, 0, 0, 0)
      )
    );
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      day: format(date, 'dd', { locale: ptBR }),
      total,
      date: format(date, 'dd/MM'),
    };
  });
  
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].payload.date}</p>
          <p className="text-lg font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen pb-24 pt-6 md:pb-6 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Análise de Gastos</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Como seus gastos estão divididos</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart />
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle>Gastos por Dia</CardTitle>
              <CardDescription>
                {format(start, 'MMMM yyyy', { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daysInMonth} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      hide={true}
                      domain={[0, 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="total" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {daysInMonth.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.total > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                          fillOpacity={entry.total > 0 ? 0.8 : 0.3}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {categoriesStats.length > 0 && (
          <div className="mt-6">
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle>Detalhes por Categoria</CardTitle>
                <CardDescription>Análise detalhada de seus gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoriesStats.map((stat) => (
                    <div key={stat.category}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: stat.color }}
                          />
                          <span className="font-medium">{stat.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{formatCurrency(stat.amount)}</span>
                          <span className="ml-2 text-sm text-muted-foreground">({stat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out-expo"
                          style={{ 
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color 
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        {expenses
                          .filter(expense => expense.category === stat.category)
                          .sort((a, b) => b.amount - a.amount)
                          .slice(0, 3)
                          .map(expense => (
                            <div key={expense.id} className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{expense.name}</span>
                              <span>{formatCurrency(expense.amount)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Header />
    </div>
  );
};

export default Analysis;
