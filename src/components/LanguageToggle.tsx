import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
      className="flex items-center gap-2 text-sm font-medium"
    >
      <Globe className="h-4 w-4" />
      <span className={language === 'ml' ? 'font-malayalam' : ''}>
        {language === 'en' ? 'മലയാളം' : 'English'}
      </span>
    </Button>
  );
}
