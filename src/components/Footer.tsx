import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-sm">🏛️</span>
            </div>
            <span className={cn(
              "text-sm font-medium text-muted-foreground",
              language === 'ml' && "font-malayalam"
            )}>
              {t.poweredBy} {t.appName}
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className={cn(
              "hover:text-foreground transition-colors",
              language === 'ml' && "font-malayalam"
            )}>
              {t.privacyPolicy}
            </a>
            <a href="#" className={cn(
              "hover:text-foreground transition-colors",
              language === 'ml' && "font-malayalam"
            )}>
              {t.termsOfService}
            </a>
            <a href="#" className={cn(
              "hover:text-foreground transition-colors",
              language === 'ml' && "font-malayalam"
            )}>
              {t.contact}
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Panchayat Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
