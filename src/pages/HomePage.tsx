import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IssuesMap } from '@/components/IssuesMap';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { getAllReports, initializeSampleData } from '@/lib/storage';
import { categoryIcons } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight, FileText, Search, MapPin, Shield, Users, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Report } from '@/lib/types';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    initializeSampleData();
    setReports(getAllReports().slice(0, 5));
  }, []);

  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
    inProgress: reports.filter(r => r.status === 'inProgress').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero text-primary-foreground">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          
          <div className="container relative py-16 md:py-24">
            <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm">
                <span className="text-lg">🏛️</span>
                <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.appName}</span>
              </div>
              
              <h1 className={cn(
                "text-3xl md:text-5xl font-bold leading-tight",
                language === 'ml' && "font-malayalam"
              )}>
                {t.heroTitle}
              </h1>
              
              <p className={cn(
                "text-lg md:text-xl text-white/80",
                language === 'ml' && "font-malayalam"
              )}>
                {t.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/report"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-elevated"
                >
                  <FileText className="h-5 w-5" />
                  <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.reportNow}</span>
                </Link>
                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-lg transition-all duration-200 hover:bg-white/20"
                >
                  <Search className="h-5 w-5" />
                  <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.trackYourIssue}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, label: t.totalComplaints, value: stats.total, color: 'text-info' },
              { icon: CheckCircle, label: t.resolvedCount, value: stats.resolved, color: 'text-success' },
              { icon: Users, label: t.inProgressCount, value: stats.inProgress, color: 'text-accent' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="card-elevated p-6 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("w-14 h-14 rounded-xl bg-secondary flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    language === 'ml' && "font-malayalam"
                  )}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: language === 'en' ? 'Auto Location' : 'ഓട്ടോ ലൊക്കേഷൻ',
                description: language === 'en' 
                  ? 'Automatically detect your location and nearest Panchayat'
                  : 'നിങ്ങളുടെ ലൊക്കേഷനും അടുത്തുള്ള പഞ്ചായത്തും സ്വയമേവ കണ്ടെത്തുക',
              },
              {
                icon: Shield,
                title: language === 'en' ? 'Anonymous Reports' : 'അജ്ഞാത റിപ്പോർട്ടുകൾ',
                description: language === 'en'
                  ? 'Submit reports anonymously to protect your privacy'
                  : 'നിങ്ങളുടെ സ്വകാര്യത സംരക്ഷിക്കാൻ അജ്ഞാതമായി റിപ്പോർട്ട് ചെയ്യുക',
              },
              {
                icon: CheckCircle,
                title: language === 'en' ? 'Real-time Tracking' : 'തൽസമയ ട്രാക്കിംഗ്',
                description: language === 'en'
                  ? 'Track your issue status and get notified on updates'
                  : 'നിങ്ങളുടെ പ്രശ്ന സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക, അപ്ഡേറ്റുകൾ ലഭിക്കുക',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-interactive p-6 space-y-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className={cn(
                  "text-lg font-semibold text-foreground",
                  language === 'ml' && "font-malayalam"
                )}>
                  {feature.title}
                </h3>
                <p className={cn(
                  "text-sm text-muted-foreground",
                  language === 'ml' && "font-malayalam"
                )}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="container py-12">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn(
                "text-xl font-semibold text-foreground",
                language === 'ml' && "font-malayalam"
              )}>
                {t.publicIssuesMap}
              </h2>
            </div>
            <IssuesMap reports={reports} className="h-80 md:h-96 rounded-lg" />
          </div>
        </section>

        {/* Recent Issues Section */}
        <section className="container py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-xl font-semibold text-foreground",
              language === 'ml' && "font-malayalam"
            )}>
              {t.recentIssues}
            </h2>
            <Link
              to="/admin"
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.viewAll}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report, index) => (
              <Link
                key={report.id}
                to={`/track?id=${report.trackingId}`}
                className="card-interactive p-4 space-y-3 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryIcons[report.category]}</span>
                    <span className="text-xs font-mono text-muted-foreground">{report.trackingId}</span>
                  </div>
                  <StatusBadge status={report.status} size="sm" />
                </div>
                <h3 className="font-medium text-foreground line-clamp-1">{report.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{report.panchayat}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
