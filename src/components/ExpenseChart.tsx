
import { useAppStore } from '@/lib/store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const ExpenseChart = () => {
  const getExpensesByCategory = useAppStore(state => state.getExpensesByCategory);
  const stats = getExpensesByCategory();
  const isMobile = useIsMobile();
  
  if (stats.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center rounded-xl p-4">
        <p className="text-muted-foreground">Nenhum gasto registrado ainda</p>
      </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-lg font-bold">{formatCurrency(data.amount)}</p>
          <p className="text-sm text-muted-foreground">{data.percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  // Ajustar o tamanho do gráfico com base no dispositivo
  const chartSize = isMobile ? 60 : 80;
  const innerRadius = isMobile ? 30 : 40;

  return (
    <div className="glass-card overflow-hidden rounded-xl p-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={chartSize}
              innerRadius={innerRadius}
              dataKey="amount"
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className={`mt-4 ${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
        {stats.map((stat) => (
          <div key={stat.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: stat.color }}
              />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{stat.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{formatCurrency(stat.amount)}</span>
              <span className="text-xs text-muted-foreground">({stat.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
