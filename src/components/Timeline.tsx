import { TimelineEntry } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatusBadge } from './StatusBadge';
import { Check, Clock, Users, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineProps {
  history: TimelineEntry[];
}

const statusIcons = {
  submitted: Clock,
  received: Check,
  assigned: Users,
  inProgress: Wrench,
  resolved: CheckCircle,
  closed: XCircle,
};

export function Timeline({ history }: TimelineProps) {
  const { t, language } = useLanguage();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative">
      {history.map((entry, index) => {
        const Icon = statusIcons[entry.status];
        const isLast = index === history.length - 1;

        return (
          <div key={index} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
            )}

            {/* Icon */}
            <div className={cn(
              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              isLast ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <StatusBadge status={entry.status} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
              {entry.note && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  language === 'ml' && "font-malayalam"
                )}>
                  {entry.note}
                </p>
              )}
              {entry.actor && (
                <p className="text-xs text-muted-foreground mt-1">
                  — {entry.actor}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
