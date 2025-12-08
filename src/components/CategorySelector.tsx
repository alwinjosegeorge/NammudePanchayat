import { Category, categoryIcons } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: Category | null;
  onChange: (category: Category) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { t, language } = useLanguage();

  const categories: Category[] = [
    'brokenRoad',
    'streetlight',
    'waterLeak',
    'drainage',
    'garbage',
    'electricity',
    'publicProperty',
    'other',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
            value === category
              ? "border-primary bg-primary/5 shadow-soft"
              : "border-border bg-card hover:border-primary/50 hover:bg-secondary"
          )}
        >
          <span className="text-2xl">{categoryIcons[category]}</span>
          <span className={cn(
            "text-xs font-medium text-center leading-tight",
            value === category ? "text-primary" : "text-muted-foreground",
            language === 'ml' && "font-malayalam"
          )}>
            {t.categories[category]}
          </span>
        </button>
      ))}
    </div>
  );
}
