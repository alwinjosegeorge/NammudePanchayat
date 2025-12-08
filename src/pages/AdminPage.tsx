import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IssuesMap } from '@/components/IssuesMap';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { getAllReports, updateReportStatus, assignTeamToReport, addInternalNote } from '@/lib/storage';
import { Report, Status, Team, Category, categoryIcons } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  List,
  Map,
  BarChart3,
  Settings,
  Filter,
  Download,
  Users,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ViewMode = 'list' | 'map' | 'analytics';

export default function AdminPage() {
  const { t, language } = useLanguage();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filters, setFilters] = useState({
    status: '' as Status | '',
    category: '' as Category | '',
    urgency: '' as 'normal' | 'high' | 'urgent' | '',
    panchayat: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setReports(getAllReports());
  };

  const filteredReports = reports.filter((report) => {
    if (filters.status && report.status !== filters.status) return false;
    if (filters.category && report.category !== filters.category) return false;
    if (filters.urgency && report.urgency !== filters.urgency) return false;
    if (filters.panchayat && !report.panchayat.toLowerCase().includes(filters.panchayat.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'submitted' || r.status === 'received').length,
    inProgress: reports.filter(r => r.status === 'assigned' || r.status === 'inProgress').length,
    resolved: reports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
    urgent: reports.filter(r => r.urgency === 'urgent' && r.status !== 'resolved' && r.status !== 'closed').length,
  };

  const categoryStats = Object.entries(
    reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const handleStatusUpdate = (id: string, status: Status) => {
    const updated = updateReportStatus(id, status, undefined, 'Admin');
    if (updated) {
      loadReports();
      setSelectedReport(updated);
      toast.success(language === 'en' ? 'Status updated' : 'സ്റ്റാറ്റസ് അപ്ഡേറ്റ് ചെയ്തു');
    }
  };

  const handleTeamAssign = (id: string, team: Team) => {
    const updated = assignTeamToReport(id, team);
    if (updated) {
      loadReports();
      setSelectedReport(updated);
      toast.success(language === 'en' ? 'Team assigned' : 'ടീം നിയോഗിച്ചു');
    }
  };

  const handleAddNote = (id: string) => {
    if (!newNote.trim()) return;
    const updated = addInternalNote(id, newNote);
    if (updated) {
      loadReports();
      setSelectedReport(updated);
      setNewNote('');
      toast.success(language === 'en' ? 'Note added' : 'കുറിപ്പ് ചേർത്തു');
    }
  };

  const exportCSV = () => {
    const headers = ['Tracking ID', 'Title', 'Category', 'Status', 'Urgency', 'Panchayat', 'Created At'];
    const rows = filteredReports.map(r => [
      r.trackingId,
      r.title,
      r.category,
      r.status,
      r.urgency,
      r.panchayat,
      new Date(r.createdAt).toLocaleString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(language === 'en' ? 'CSV exported' : 'CSV എക്സ്പോർട്ട് ചെയ്തു');
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={cn(
                "text-2xl font-bold text-foreground",
                language === 'ml' && "font-malayalam"
              )}>
                {t.dashboard}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {language === 'en' ? 'Manage and track all reported issues' : 'റിപ്പോർട്ട് ചെയ്ത എല്ലാ പ്രശ്നങ്ങളും നിയന്ത്രിക്കുകയും ട്രാക്ക് ചെയ്യുകയും ചെയ്യുക'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-secondary rounded-lg p-1">
                {[
                  { mode: 'list' as ViewMode, icon: List, label: 'List' },
                  { mode: 'map' as ViewMode, icon: Map, label: 'Map' },
                  { mode: 'analytics' as ViewMode, icon: BarChart3, label: 'Analytics' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === mode
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: t.totalComplaints, value: stats.total, icon: LayoutDashboard, color: 'text-info' },
              { label: t.pending, value: stats.pending, icon: Clock, color: 'text-warning' },
              { label: t.inProgressCount, value: stats.inProgress, icon: TrendingUp, color: 'text-accent' },
              { label: t.resolvedCount, value: stats.resolved, icon: CheckCircle, color: 'text-success' },
              { label: language === 'en' ? 'Urgent' : 'അടിയന്തരം', value: stats.urgent, icon: AlertTriangle, color: 'text-urgent' },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg bg-secondary flex items-center justify-center", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={cn(
                      "text-xs text-muted-foreground",
                      language === 'ml' && "font-malayalam"
                    )}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="card-elevated p-4">
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.filterBy}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportCSV}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.exportCsv}</span>
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border animate-slide-up">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value as Status | '' })}
                      className="input-field text-sm"
                    >
                      <option value="">{language === 'en' ? 'All Status' : 'എല്ലാ സ്റ്റാറ്റസും'}</option>
                      {(['submitted', 'received', 'assigned', 'inProgress', 'resolved', 'closed'] as Status[]).map((s) => (
                        <option key={s} value={s}>{t.status[s]}</option>
                      ))}
                    </select>

                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as Category | '' })}
                      className="input-field text-sm"
                    >
                      <option value="">{language === 'en' ? 'All Categories' : 'എല്ലാ വിഭാഗങ്ങളും'}</option>
                      {Object.keys(t.categories).map((c) => (
                        <option key={c} value={c}>{t.categories[c as keyof typeof t.categories]}</option>
                      ))}
                    </select>

                    <select
                      value={filters.urgency}
                      onChange={(e) => setFilters({ ...filters, urgency: e.target.value as 'normal' | 'high' | 'urgent' | '' })}
                      className="input-field text-sm"
                    >
                      <option value="">{language === 'en' ? 'All Urgency' : 'എല്ലാ അടിയന്തരാവസ്ഥയും'}</option>
                      <option value="normal">{t.normal}</option>
                      <option value="high">{t.high}</option>
                      <option value="urgent">{t.urgent}</option>
                    </select>

                    <input
                      type="text"
                      value={filters.panchayat}
                      onChange={(e) => setFilters({ ...filters, panchayat: e.target.value })}
                      placeholder={language === 'en' ? 'Search Panchayat...' : 'പഞ്ചായത്ത് തിരയുക...'}
                      className="input-field text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Reports Table */}
              <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Issue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Urgency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono text-muted-foreground">{report.trackingId}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{categoryIcons[report.category]}</span>
                              <span className="font-medium text-foreground line-clamp-1 max-w-48">{report.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={report.status} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <UrgencyBadge urgency={report.urgency} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1 max-w-32">{report.panchayat}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(report.createdAt)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredReports.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    {language === 'en' ? 'No complaints found' : 'പരാതികളൊന്നും കണ്ടെത്തിയില്ല'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="card-elevated p-4">
              <IssuesMap reports={filteredReports} className="h-[600px] rounded-lg" />
            </div>
          )}

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="card-elevated p-6">
                <h3 className={cn(
                  "font-semibold text-foreground mb-4",
                  language === 'ml' && "font-malayalam"
                )}>
                  {language === 'en' ? 'Complaints by Category' : 'വിഭാഗം അനുസരിച്ച് പരാതികൾ'}
                </h3>
                <div className="space-y-3">
                  {categoryStats.map(([category, count]) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-xl w-8">{categoryIcons[category as Category]}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-sm text-foreground",
                            language === 'ml' && "font-malayalam"
                          )}>
                            {t.categories[category as keyof typeof t.categories]}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="card-elevated p-6">
                <h3 className={cn(
                  "font-semibold text-foreground mb-4",
                  language === 'ml' && "font-malayalam"
                )}>
                  {language === 'en' ? 'Resolution Overview' : 'പരിഹാര അവലോകനം'}
                </h3>
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Pending */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="20"
                        strokeDasharray={`${(stats.pending / stats.total) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                      {/* In Progress */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--accent))"
                        strokeWidth="20"
                        strokeDasharray={`${(stats.inProgress / stats.total) * 251.2} 251.2`}
                        strokeDashoffset={`-${(stats.pending / stats.total) * 251.2}`}
                        strokeLinecap="round"
                      />
                      {/* Resolved */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--success))"
                        strokeWidth="20"
                        strokeDasharray={`${(stats.resolved / stats.total) * 251.2} 251.2`}
                        strokeDashoffset={`-${((stats.pending + stats.inProgress) / stats.total) * 251.2}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{stats.total}</span>
                      <span className="text-xs text-muted-foreground">Total</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-sm text-muted-foreground">Pending ({stats.pending})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-sm text-muted-foreground">In Progress ({stats.inProgress})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Resolved ({stats.resolved})</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Report Detail Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
          <div className="relative w-full max-w-lg bg-card border-l border-border shadow-elevated overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-muted-foreground">{selectedReport.trackingId}</span>
                <h2 className="font-semibold text-foreground">{selectedReport.title}</h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Status & Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedReport.status} />
                  <UrgencyBadge urgency={selectedReport.urgency} />
                  <span className="status-badge bg-secondary text-secondary-foreground">
                    {categoryIcons[selectedReport.category]} {t.categories[selectedReport.category as keyof typeof t.categories]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>

                <div className="text-sm text-muted-foreground">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {selectedReport.address}
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-2">
                <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                  {t.updateStatus}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['received', 'assigned', 'inProgress', 'resolved', 'closed'] as Status[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedReport.id, status)}
                      className={cn(
                        "px-3 py-2 text-xs rounded-lg border transition-colors",
                        selectedReport.status === status
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary hover:bg-secondary"
                      )}
                    >
                      {t.status[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Team */}
              <div className="space-y-2">
                <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                  {t.assignTeam}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['roads', 'water', 'electricity', 'sanitation', 'general'] as Team[]).map((team) => (
                    <button
                      key={team}
                      onClick={() => handleTeamAssign(selectedReport.id, team)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-colors",
                        selectedReport.assignedTeam === team
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary hover:bg-secondary"
                      )}
                    >
                      <Users className="h-3 w-3" />
                      {t.teams[team]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                  {t.internalNotes}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={language === 'en' ? 'Add a note...' : 'കുറിപ്പ് ചേർക്കുക...'}
                    className="input-field flex-1 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedReport.id)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddNote(selectedReport.id)}
                    disabled={!newNote.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                {selectedReport.internalNotes && selectedReport.internalNotes.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedReport.internalNotes.map((note, i) => (
                      <div key={i} className="p-2 bg-secondary rounded-lg text-xs text-muted-foreground">
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              {!selectedReport.anonymous && selectedReport.contact && (
                <div className="space-y-2">
                  <label className="label-text">Contact</label>
                  <div className="text-sm text-muted-foreground">
                    {selectedReport.contact.phone && <p>📱 {selectedReport.contact.phone}</p>}
                    {selectedReport.contact.email && <p>✉️ {selectedReport.contact.email}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
