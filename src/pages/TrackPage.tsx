import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocationMap } from '@/components/LocationMap';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { Timeline } from '@/components/Timeline';
import { getReportByTrackingId } from '@/lib/storage';
import { Report, categoryIcons } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TrackPage() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [report, setReport] = useState<Report | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
      handleSearch(id);
    }
  }, [searchParams]);

  const handleSearch = (id?: string) => {
    const searchId = id || trackingId;
    if (!searchId.trim()) return;
    
    setIsLoading(true);
    setSearched(true);
    
    // Simulate network delay
    setTimeout(() => {
      const found = getReportByTrackingId(searchId.toUpperCase());
      setReport(found);
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'ml' ? 'ml-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={cn(
            "text-2xl font-bold text-foreground mb-8",
            language === 'ml' && "font-malayalam"
          )}>
            {t.trackIssue}
          </h1>

          {/* Search Form */}
          <div className="card-elevated p-6 mb-8">
            <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
              {t.enterTrackingId}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder={t.trackingIdPlaceholder}
                className="input-field flex-1 font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={() => handleSearch()}
                disabled={isLoading || !trackingId.trim()}
                className="btn-primary px-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.track}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results */}
          {searched && !isLoading && (
            <div className="animate-slide-up">
              {report ? (
                <div className="space-y-6">
                  {/* Issue Header */}
                  <div className="card-elevated p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{categoryIcons[report.category]}</span>
                        <div>
                          <span className="text-sm font-mono text-muted-foreground">{report.trackingId}</span>
                          <h2 className="text-xl font-semibold text-foreground">{report.title}</h2>
                        </div>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>

                    <p className={cn(
                      "text-muted-foreground mb-4",
                      language === 'ml' && "font-malayalam"
                    )}>
                      {report.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{report.panchayat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(report.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                      <UrgencyBadge urgency={report.urgency} />
                      <span className={cn(
                        "status-badge bg-secondary text-secondary-foreground",
                        language === 'ml' && "font-malayalam"
                      )}>
                        {t.categories[report.category as keyof typeof t.categories]}
                      </span>
                      {report.assignedTeam && (
                        <span className="status-badge bg-primary/10 text-primary">
                          {t.teams[report.assignedTeam as keyof typeof t.teams]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Photos */}
                  {report.photos.length > 0 && (
                    <div className="card-elevated p-6">
                      <h3 className={cn(
                        "font-semibold text-foreground mb-4",
                        language === 'ml' && "font-malayalam"
                      )}>
                        {language === 'en' ? 'Photos' : 'ഫോട്ടോകൾ'}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {report.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="card-elevated p-6">
                    <h3 className={cn(
                      "font-semibold text-foreground mb-4",
                      language === 'ml' && "font-malayalam"
                    )}>
                      {language === 'en' ? 'Location' : 'ലൊക്കേഷൻ'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.address}</p>
                    <LocationMap
                      lat={report.lat}
                      lng={report.lng}
                      className="h-48 rounded-lg border border-border"
                    />
                  </div>

                  {/* Timeline */}
                  <div className="card-elevated p-6">
                    <h3 className={cn(
                      "font-semibold text-foreground mb-6",
                      language === 'ml' && "font-malayalam"
                    )}>
                      {t.timeline}
                    </h3>
                    <Timeline history={report.history} />
                  </div>
                </div>
              ) : (
                <div className="card-elevated p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className={cn(
                    "text-lg font-semibold text-foreground mb-2",
                    language === 'ml' && "font-malayalam"
                  )}>
                    {t.noResults}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' 
                      ? 'No report found with the given tracking ID. Please check and try again.'
                      : 'നൽകിയ ട്രാക്കിംഗ് ഐഡി ഉപയോഗിച്ച് റിപ്പോർട്ടൊന്നും കണ്ടെത്തിയില്ല.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
