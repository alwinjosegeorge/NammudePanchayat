import { Status } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t, language } = useLanguage();

  const statusClasses: Record<Status, string> = {
    submitted: 'status-submitted',
    received: 'status-received',
    assigned: 'status-assigned',
    inProgress: 'status-in-progress',
    resolved: 'status-resolved',
    closed: 'status-closed',
  };

  return (
    <span className={cn(
      'status-badge',
      statusClasses[status],
      size === 'sm' && 'text-xs px-2 py-0.5',
      language === 'ml' && 'font-malayalam'
    )}>
      {t.status[status]}
    </span>
  );
}

interface UrgencyBadgeProps {
  urgency: 'normal' | 'high' | 'urgent';
  size?: 'sm' | 'md';
}

export function UrgencyBadge({ urgency, size = 'md' }: UrgencyBadgeProps) {
  const { t, language } = useLanguage();

  const urgencyClasses: Record<string, string> = {
    normal: 'urgency-normal',
    high: 'urgency-high',
    urgent: 'urgency-urgent',
  };

  const labels: Record<string, string> = {
    normal: t.normal,
    high: t.high,
    urgent: t.urgent,
  };

  return (
    <span className={cn(
      'status-badge',
      urgencyClasses[urgency],
      size === 'sm' && 'text-xs px-2 py-0.5',
      language === 'ml' && 'font-malayalam'
    )}>
      {labels[urgency]}
    </span>
  );
}
