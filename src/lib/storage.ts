import { Report, Status, Team, TimelineEntry } from './types';

const REPORTS_KEY = 'panchayat_reports';
const COUNTER_KEY = 'panchayat_report_counter';

export function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const counter = getAndIncrementCounter();
  const paddedCounter = counter.toString().padStart(4, '0');
  return `PTH-${year}-${paddedCounter}`;
}

function getAndIncrementCounter(): number {
  const stored = localStorage.getItem(COUNTER_KEY);
  const counter = stored ? parseInt(stored, 10) : 0;
  localStorage.setItem(COUNTER_KEY, (counter + 1).toString());
  return counter + 1;
}

export function saveReport(report: Report): void {
  const reports = getAllReports();
  reports.unshift(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getAllReports(): Report[] {
  const stored = localStorage.getItem(REPORTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getReportByTrackingId(trackingId: string): Report | null {
  const reports = getAllReports();
  return reports.find(r => r.trackingId === trackingId) || null;
}

export function getReportById(id: string): Report | null {
  const reports = getAllReports();
  return reports.find(r => r.id === id) || null;
}

export function updateReportStatus(
  id: string, 
  newStatus: Status, 
  note?: string,
  actor?: string
): Report | null {
  const reports = getAllReports();
  const index = reports.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  const report = reports[index];
  const timelineEntry: TimelineEntry = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note,
    actor,
  };
  
  report.status = newStatus;
  report.updatedAt = new Date().toISOString();
  report.history.push(timelineEntry);
  
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return report;
}

export function assignTeamToReport(id: string, team: Team): Report | null {
  const reports = getAllReports();
  const index = reports.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  const report = reports[index];
  report.assignedTeam = team;
  report.updatedAt = new Date().toISOString();
  
  if (report.status === 'submitted' || report.status === 'received') {
    report.status = 'assigned';
    report.history.push({
      status: 'assigned',
      timestamp: new Date().toISOString(),
      note: `Assigned to ${team} team`,
    });
  }
  
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return report;
}

export function addInternalNote(id: string, note: string): Report | null {
  const reports = getAllReports();
  const index = reports.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  const report = reports[index];
  if (!report.internalNotes) {
    report.internalNotes = [];
  }
  report.internalNotes.push(`[${new Date().toLocaleString()}] ${note}`);
  report.updatedAt = new Date().toISOString();
  
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return report;
}

// Draft functionality
const DRAFT_KEY = 'panchayat_report_draft';

export function saveDraft(draft: Partial<Report>): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraft(): Partial<Report> | null {
  const stored = localStorage.getItem(DRAFT_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  const reports = getAllReports();
  if (reports.length > 0) return;

  const sampleReports: Report[] = [
    {
      id: 'sample-1',
      trackingId: 'PTH-2025-0001',
      category: 'brokenRoad',
      title: 'Large pothole near bus stop',
      description: 'There is a large pothole approximately 2 feet wide near the main bus stop. It poses a danger to two-wheelers and pedestrians.',
      panchayat: 'Thiruvananthapuram',
      address: 'Near Central Bus Stand, MG Road',
      lat: 8.5241,
      lng: 76.9366,
      urgency: 'high',
      photos: [],
      anonymous: false,
      status: 'inProgress',
      assignedTeam: 'roads',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      history: [
        { status: 'submitted', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'received', timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'assigned', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Assigned to Roads Team' },
        { status: 'inProgress', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Work started' },
      ],
    },
    {
      id: 'sample-2',
      trackingId: 'PTH-2025-0002',
      category: 'streetlight',
      title: 'Street light not working',
      description: 'The street light outside house no. 45 has not been working for the past week.',
      panchayat: 'Kochi',
      address: '45, Temple Road, Fort Kochi',
      lat: 9.9659,
      lng: 76.2421,
      urgency: 'normal',
      photos: [],
      anonymous: true,
      status: 'resolved',
      assignedTeam: 'electricity',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      history: [
        { status: 'submitted', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'received', timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'assigned', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'inProgress', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'resolved', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Bulb replaced' },
      ],
    },
    {
      id: 'sample-3',
      trackingId: 'PTH-2025-0003',
      category: 'waterLeak',
      title: 'Water pipe burst on main road',
      description: 'Major water pipe burst causing water wastage and road flooding.',
      panchayat: 'Kozhikode',
      address: 'SM Street, Near Railway Station',
      lat: 11.2588,
      lng: 75.7804,
      urgency: 'urgent',
      photos: [],
      anonymous: false,
      contact: { phone: '9876543210' },
      status: 'submitted',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      history: [
        { status: 'submitted', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ];

  sampleReports.forEach(report => saveReport(report));
  localStorage.setItem(COUNTER_KEY, '3');
}
