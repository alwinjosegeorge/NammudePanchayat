export type Language = 'en' | 'ml';

export const translations = {
  en: {
    // Common
    appName: 'Panchayat Connect',
    tagline: 'Report Issues, Track Progress, Build Better Communities',
    
    // Navigation
    home: 'Home',
    reportIssue: 'Report Issue',
    trackIssue: 'Track Issue',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    
    // Home Page
    heroTitle: 'Report Local Issues Easily',
    heroSubtitle: 'Help improve your community by reporting problems in your area. Track progress and get updates.',
    reportNow: 'Report Now',
    trackYourIssue: 'Track Your Issue',
    recentIssues: 'Recent Issues',
    viewAll: 'View All',
    
    // Categories
    categories: {
      brokenRoad: 'Broken Road / Pothole',
      streetlight: 'Streetlight Not Working',
      waterLeak: 'Water Leak / Pipe Burst',
      drainage: 'Drainage / Flooding',
      garbage: 'Garbage / Waste',
      electricity: 'Electricity',
      publicProperty: 'Public Property Damage',
      other: 'Other',
    },
    
    // Report Form
    selectCategory: 'Select Category',
    issueTitle: 'Issue Title',
    issueTitlePlaceholder: 'Brief description (max 50 characters)',
    description: 'Description',
    descriptionPlaceholder: 'Provide details about the issue...',
    uploadPhotos: 'Upload Photos',
    uploadPhotosHint: 'Upload 1-3 photos of the issue',
    detectLocation: 'Detect Location',
    detecting: 'Detecting...',
    panchayatName: 'Panchayat Name',
    address: 'Address',
    coordinates: 'Coordinates',
    urgencyLevel: 'Urgency Level',
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    contactOptional: 'Contact (Optional)',
    phone: 'Phone',
    email: 'Email',
    submitAnonymously: 'Submit Anonymously',
    submit: 'Submit Report',
    submitting: 'Submitting...',
    
    // Confirmation
    reportSubmitted: 'Report Submitted Successfully!',
    trackingId: 'Your Tracking ID',
    copyTrackingId: 'Copy Tracking ID',
    copied: 'Copied!',
    trackingIdSaved: 'Save this ID to track your issue',
    
    // Track Issue
    enterTrackingId: 'Enter Tracking ID',
    trackingIdPlaceholder: 'e.g., PTH-2025-0001',
    track: 'Track',
    issueDetails: 'Issue Details',
    timeline: 'Timeline',
    
    // Status
    status: {
      submitted: 'Submitted',
      received: 'Received',
      assigned: 'Assigned',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    },
    
    // Teams
    teams: {
      roads: 'Roads Team',
      water: 'Waterworks Team',
      electricity: 'Electricity Team',
      sanitation: 'Sanitation Team',
      general: 'General Maintenance',
    },
    
    // Admin
    dashboard: 'Dashboard',
    allComplaints: 'All Complaints',
    analytics: 'Analytics',
    settings: 'Settings',
    totalComplaints: 'Total Complaints',
    pending: 'Pending',
    inProgressCount: 'In Progress',
    resolvedCount: 'Resolved',
    filterBy: 'Filter By',
    exportCsv: 'Export CSV',
    assignTeam: 'Assign Team',
    updateStatus: 'Update Status',
    addNote: 'Add Note',
    internalNotes: 'Internal Notes',
    
    // Map
    publicIssuesMap: 'Public Issues Map',
    mapLegend: 'Map Legend',
    
    // Footer
    poweredBy: 'Powered by',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contact: 'Contact',
    
    // Misc
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    noResults: 'No results found',
    selectOption: 'Select an option',
  },
  ml: {
    // Common
    appName: 'പഞ്ചായത്ത് കണക്ട്',
    tagline: 'പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യുക, പുരോഗതി ട്രാക്ക് ചെയ്യുക, മികച്ച കമ്മ്യൂണിറ്റികൾ നിർമ്മിക്കുക',
    
    // Navigation
    home: 'ഹോം',
    reportIssue: 'പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക',
    trackIssue: 'പ്രശ്നം ട്രാക്ക് ചെയ്യുക',
    admin: 'അഡ്മിൻ',
    login: 'ലോഗിൻ',
    logout: 'ലോഗൗട്ട്',
    
    // Home Page
    heroTitle: 'പ്രാദേശിക പ്രശ്നങ്ങൾ എളുപ്പത്തിൽ റിപ്പോർട്ട് ചെയ്യുക',
    heroSubtitle: 'നിങ്ങളുടെ പ്രദേശത്തെ പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്ത് കമ്മ്യൂണിറ്റി മെച്ചപ്പെടുത്താൻ സഹായിക്കുക.',
    reportNow: 'ഇപ്പോൾ റിപ്പോർട്ട് ചെയ്യുക',
    trackYourIssue: 'നിങ്ങളുടെ പ്രശ്നം ട്രാക്ക് ചെയ്യുക',
    recentIssues: 'സമീപകാല പ്രശ്നങ്ങൾ',
    viewAll: 'എല്ലാം കാണുക',
    
    // Categories
    categories: {
      brokenRoad: 'തകർന്ന റോഡ് / കുഴി',
      streetlight: 'തെരുവ് വിളക്ക് പ്രവർത്തിക്കുന്നില്ല',
      waterLeak: 'വെള്ളം ചോർച്ച / പൈപ്പ് പൊട്ടൽ',
      drainage: 'ഡ്രെയിനേജ് / വെള്ളപ്പൊക്കം',
      garbage: 'മാലിന്യം / വേസ്റ്റ്',
      electricity: 'വൈദ്യുതി',
      publicProperty: 'പൊതു സ്വത്ത് കേടുപാട്',
      other: 'മറ്റുള്ളവ',
    },
    
    // Report Form
    selectCategory: 'വിഭാഗം തിരഞ്ഞെടുക്കുക',
    issueTitle: 'പ്രശ്ന ശീർഷകം',
    issueTitlePlaceholder: 'ഹ്രസ്വ വിവരണം (പരമാവധി 50 അക്ഷരങ്ങൾ)',
    description: 'വിവരണം',
    descriptionPlaceholder: 'പ്രശ്നത്തെക്കുറിച്ച് വിശദാംശങ്ങൾ നൽകുക...',
    uploadPhotos: 'ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക',
    uploadPhotosHint: 'പ്രശ്നത്തിന്റെ 1-3 ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക',
    detectLocation: 'ലൊക്കേഷൻ കണ്ടെത്തുക',
    detecting: 'കണ്ടെത്തുന്നു...',
    panchayatName: 'പഞ്ചായത്ത് പേര്',
    address: 'വിലാസം',
    coordinates: 'കോർഡിനേറ്റുകൾ',
    urgencyLevel: 'അടിയന്തര നില',
    urgent: 'അടിയന്തരം',
    high: 'ഉയർന്നത്',
    normal: 'സാധാരണ',
    contactOptional: 'ബന്ധപ്പെടാൻ (ഓപ്ഷണൽ)',
    phone: 'ഫോൺ',
    email: 'ഇമെയിൽ',
    submitAnonymously: 'അജ്ഞാതമായി സമർപ്പിക്കുക',
    submit: 'റിപ്പോർട്ട് സമർപ്പിക്കുക',
    submitting: 'സമർപ്പിക്കുന്നു...',
    
    // Confirmation
    reportSubmitted: 'റിപ്പോർട്ട് വിജയകരമായി സമർപ്പിച്ചു!',
    trackingId: 'നിങ്ങളുടെ ട്രാക്കിംഗ് ഐഡി',
    copyTrackingId: 'ട്രാക്കിംഗ് ഐഡി കോപ്പി ചെയ്യുക',
    copied: 'കോപ്പി ചെയ്തു!',
    trackingIdSaved: 'നിങ്ങളുടെ പ്രശ്നം ട്രാക്ക് ചെയ്യാൻ ഈ ഐഡി സേവ് ചെയ്യുക',
    
    // Track Issue
    enterTrackingId: 'ട്രാക്കിംഗ് ഐഡി നൽകുക',
    trackingIdPlaceholder: 'ഉദാ: PTH-2025-0001',
    track: 'ട്രാക്ക്',
    issueDetails: 'പ്രശ്ന വിശദാംശങ്ങൾ',
    timeline: 'ടൈംലൈൻ',
    
    // Status
    status: {
      submitted: 'സമർപ്പിച്ചു',
      received: 'ലഭിച്ചു',
      assigned: 'നിയോഗിച്ചു',
      inProgress: 'പുരോഗതിയിൽ',
      resolved: 'പരിഹരിച്ചു',
      closed: 'അടച്ചു',
    },
    
    // Teams
    teams: {
      roads: 'റോഡ് ടീം',
      water: 'ജലവിതരണ ടീം',
      electricity: 'വൈദ്യുതി ടീം',
      sanitation: 'ശുചീകരണ ടീം',
      general: 'ജനറൽ മെയിന്റനൻസ്',
    },
    
    // Admin
    dashboard: 'ഡാഷ്ബോർഡ്',
    allComplaints: 'എല്ലാ പരാതികളും',
    analytics: 'അനലിറ്റിക്സ്',
    settings: 'ക്രമീകരണങ്ങൾ',
    totalComplaints: 'ആകെ പരാതികൾ',
    pending: 'തീർപ്പുകൽപ്പിക്കാത്തത്',
    inProgressCount: 'പുരോഗതിയിൽ',
    resolvedCount: 'പരിഹരിച്ചത്',
    filterBy: 'ഫിൽട്ടർ',
    exportCsv: 'CSV എക്സ്പോർട്ട്',
    assignTeam: 'ടീം നിയോഗിക്കുക',
    updateStatus: 'സ്റ്റാറ്റസ് അപ്ഡേറ്റ്',
    addNote: 'കുറിപ്പ് ചേർക്കുക',
    internalNotes: 'ആന്തരിക കുറിപ്പുകൾ',
    
    // Map
    publicIssuesMap: 'പൊതു പ്രശ്ന ഭൂപടം',
    mapLegend: 'മാപ്പ് ലെജൻഡ്',
    
    // Footer
    poweredBy: 'പവർഡ് ബൈ',
    privacyPolicy: 'സ്വകാര്യതാ നയം',
    termsOfService: 'സേവന നിബന്ധനകൾ',
    contact: 'ബന്ധപ്പെടുക',
    
    // Misc
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    error: 'പിശക്',
    success: 'വിജയം',
    cancel: 'റദ്ദാക്കുക',
    save: 'സേവ് ചെയ്യുക',
    delete: 'ഇല്ലാതാക്കുക',
    edit: 'എഡിറ്റ്',
    view: 'കാണുക',
    back: 'പിന്നോട്ട്',
    next: 'അടുത്തത്',
    previous: 'മുമ്പത്തെ',
    search: 'തിരയുക',
    noResults: 'ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
    selectOption: 'ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക',
  },
};

export type TranslationKey = keyof typeof translations.en;
