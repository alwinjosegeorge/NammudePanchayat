import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategorySelector } from '@/components/CategorySelector';
import { PhotoUpload } from '@/components/PhotoUpload';
import { LocationMap } from '@/components/LocationMap';
import { detectLocation, reverseGeocode } from '@/lib/geocoding';
import { generateTrackingId, saveReport, saveDraft, getDraft, clearDraft } from '@/lib/storage';
import { Category, Urgency, Report, categoryToTeam, LocationData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MapPin, Loader2, CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function ReportPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Form state
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  
  // UI state
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPanchayatOptions, setShowPanchayatOptions] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      if (draft.category) setCategory(draft.category);
      if (draft.title) setTitle(draft.title);
      if (draft.description) setDescription(draft.description);
      if (draft.photos) setPhotos(draft.photos);
      if (draft.urgency) setUrgency(draft.urgency);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (!submitted) {
      saveDraft({
        category: category || undefined,
        title,
        description,
        photos,
        urgency,
      });
    }
  }, [category, title, description, photos, urgency, submitted]);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const locationData = await detectLocation();
      setLocation(locationData);
      
      if (locationData.possiblePanchayats && locationData.possiblePanchayats.length > 1) {
        setShowPanchayatOptions(true);
      }
      
      toast.success(language === 'en' ? 'Location detected!' : 'ലൊക്കേഷൻ കണ്ടെത്തി!');
    } catch (error) {
      console.error('Location error:', error);
      toast.error(
        language === 'en' 
          ? 'Could not detect location. Please enable location services.'
          : 'ലൊക്കേഷൻ കണ്ടെത്താനായില്ല. ലൊക്കേഷൻ സേവനങ്ങൾ പ്രവർത്തനക്ഷമമാക്കുക.'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const handleMapLocationChange = async (lat: number, lng: number) => {
    const newLocation = await reverseGeocode(lat, lng);
    setLocation(newLocation);
    
    if (newLocation.possiblePanchayats && newLocation.possiblePanchayats.length > 1) {
      setShowPanchayatOptions(true);
    }
  };

  const handlePanchayatSelect = (panchayat: string) => {
    if (location) {
      setLocation({ ...location, panchayat });
      setShowPanchayatOptions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title || !description || !location) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'എല്ലാ ആവശ്യമായ ഫീൽഡുകളും പൂരിപ്പിക്കുക');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTrackingId = generateTrackingId();
      
      const report: Report = {
        id: uuidv4(),
        trackingId: newTrackingId,
        category,
        title,
        description,
        panchayat: location.panchayat,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        urgency,
        photos,
        contact: anonymous ? undefined : { phone: phone || undefined, email: email || undefined },
        anonymous,
        status: 'submitted',
        assignedTeam: categoryToTeam[category],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            status: 'submitted',
            timestamp: new Date().toISOString(),
          },
        ],
      };

      saveReport(report);
      clearDraft();
      setTrackingId(newTrackingId);
      setSubmitted(true);
      
      toast.success(language === 'en' ? 'Report submitted successfully!' : 'റിപ്പോർട്ട് വിജയകരമായി സമർപ്പിച്ചു!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(language === 'en' ? 'Failed to submit report' : 'റിപ്പോർട്ട് സമർപ്പിക്കാനായില്ല');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(language === 'en' ? 'Copied to clipboard!' : 'ക്ലിപ്ബോർഡിലേക്ക് പകർത്തി!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            
            <h1 className={cn(
              "text-2xl font-bold text-foreground",
              language === 'ml' && "font-malayalam"
            )}>
              {t.reportSubmitted}
            </h1>
            
            <div className="card-elevated p-6 space-y-4">
              <p className={cn(
                "text-sm text-muted-foreground",
                language === 'ml' && "font-malayalam"
              )}>
                {t.trackingId}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold text-primary">{trackingId}</span>
                <button
                  onClick={copyTrackingId}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className={cn(
                "text-xs text-muted-foreground",
                language === 'ml' && "font-malayalam"
              )}>
                {t.trackingIdSaved}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => navigate(`/track?id=${trackingId}`)}
                className="w-full btn-primary py-6 text-lg"
              >
                <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.trackYourIssue}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setCategory(null);
                  setTitle('');
                  setDescription('');
                  setPhotos([]);
                  setLocation(null);
                  setUrgency('normal');
                  setPhone('');
                  setEmail('');
                  setAnonymous(false);
                }}
                className="w-full py-6 text-lg"
              >
                <span className={language === 'ml' ? 'font-malayalam' : ''}>
                  {language === 'en' ? 'Submit Another Report' : 'മറ്റൊരു റിപ്പോർട്ട് സമർപ്പിക്കുക'}
                </span>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={cn(
            "text-2xl font-bold text-foreground mb-8",
            language === 'ml' && "font-malayalam"
          )}>
            {t.reportIssue}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                {t.selectCategory} *
              </label>
              <CategorySelector value={category} onChange={setCategory} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                {t.issueTitle} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                placeholder={t.issueTitlePlaceholder}
                className={cn("input-field", language === 'ml' && "font-malayalam")}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/50</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                {t.description} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows={4}
                className={cn("input-field resize-none", language === 'ml' && "font-malayalam")}
              />
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                {t.uploadPhotos}
              </label>
              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={cn("label-text mb-0", language === 'ml' && "font-malayalam")}>
                  {t.panchayatName} *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.detecting}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.detectLocation}</span>
                    </>
                  )}
                </Button>
              </div>

              {location && (
                <div className="space-y-4 animate-slide-up">
                  {/* Panchayat Options */}
                  {showPanchayatOptions && location.possiblePanchayats && (
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 space-y-3">
                      <div className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {language === 'en' ? 'Multiple locations found' : 'ഒന്നിലധികം ലൊക്കേഷനുകൾ കണ്ടെത്തി'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {location.possiblePanchayats.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePanchayatSelect(p)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                              location.panchayat === p
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  <LocationMap
                    lat={location.lat}
                    lng={location.lng}
                    onLocationChange={handleMapLocationChange}
                    draggable={true}
                    className="h-64 rounded-lg border border-border"
                  />

                  {/* Location Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                        {t.panchayatName}
                      </label>
                      <input
                        type="text"
                        value={location.panchayat}
                        onChange={(e) => setLocation({ ...location, panchayat: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                        {t.coordinates}
                      </label>
                      <input
                        type="text"
                        value={`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                        readOnly
                        className="input-field bg-muted"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                      {t.address}
                    </label>
                    <input
                      type="text"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Urgency */}
            <div className="space-y-3">
              <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                {t.urgencyLevel}
              </label>
              <div className="flex gap-3">
                {(['normal', 'high', 'urgent'] as Urgency[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                      urgency === level
                        ? level === 'urgent'
                          ? "border-urgent bg-urgent/10 text-urgent"
                          : level === 'high'
                          ? "border-warning bg-warning/10 text-warning"
                          : "border-success bg-success/10 text-success"
                        : "border-border hover:border-primary/50",
                      language === 'ml' && "font-malayalam"
                    )}
                  >
                    {level === 'urgent' ? t.urgent : level === 'high' ? t.high : t.normal}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact (Optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={cn("label-text mb-0", language === 'ml' && "font-malayalam")}>
                  {t.contactOptional}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className={cn("text-sm text-muted-foreground", language === 'ml' && "font-malayalam")}>
                    {t.submitAnonymously}
                  </span>
                </label>
              </div>

              {!anonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                  <div>
                    <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className={cn("label-text", language === 'ml' && "font-malayalam")}>
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !category || !title || !description || !location}
              className="w-full btn-primary py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.submitting}</span>
                </>
              ) : (
                <span className={language === 'ml' ? 'font-malayalam' : ''}>{t.submit}</span>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
