
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, BarChart3, CreditCard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/', label: 'Início', icon: LayoutDashboard },
    { path: '/accounts', label: 'Contas', icon: CreditCard },
    { path: '/expenses', label: 'Gastos', icon: Receipt },
    { path: '/analysis', label: 'Análise', icon: BarChart3 },
  ];

  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 pb-6 pt-4 md:top-0 md:bottom-auto md:pt-6 md:pb-4">
      <nav className="container mx-auto px-4">
        <div className="glass mx-auto flex max-w-md items-center justify-around rounded-full px-4 py-2 shadow-lg transition-all md:max-w-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            const iconSize = isMobile ? 18 : 20;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-auto md:px-4 md:gap-2",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                aria-label={item.label}
              >
                <Icon size={iconSize} className="transition-all" />
                <span className="hidden text-sm font-medium md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
