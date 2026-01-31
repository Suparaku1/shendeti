import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, Calendar, MapPin, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MeasurementHistory } from '@/types/health';
import { AIR_QUALITY_LABELS } from '@/types/health';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MeasurementHistory[];
  onExport: () => string;
  onClear: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const riskIcons = {
  low: { icon: CheckCircle2, color: 'text-success' },
  medium: { icon: AlertCircle, color: 'text-warning' },
  high: { icon: AlertTriangle, color: 'text-danger' },
};

export function HistoryModal({ isOpen, onClose, history, onExport, onClear }: HistoryModalProps) {
  const handleExport = () => {
    const csv = onExport();
    if (!csv) return;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthadvisor-historiku-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={backdropVariants}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            variants={modalVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-card shadow-lg border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-xl font-semibold text-foreground">Historiku i Matjeve</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 max-h-[60vh]">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nuk ka matje të ruajtura.</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Kryeni një matje për ta parë këtu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry, index) => {
                    const riskLevel = entry.recommendation?.riskLevel || 'low';
                    const RiskIcon = riskIcons[riskLevel].icon;
                    const riskColor = riskIcons[riskLevel].color;
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="p-4 rounded-xl border border-border/50 hover:shadow-card transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">
                                  {new Date(entry.date).toLocaleDateString('sq-AL', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.date).toLocaleTimeString('sq-AL', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {entry.location && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {entry.location}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-lg bg-secondary/50 px-2 py-1 text-xs">
                                  Ajri: {AIR_QUALITY_LABELS[entry.data.airQuality]}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-secondary/50 px-2 py-1 text-xs">
                                  {entry.data.temperature}°C
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-secondary/50 px-2 py-1 text-xs">
                                  {entry.data.humidity}%
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-secondary/50 px-2 py-1 text-xs">
                                  Gaz: {entry.data.gasLevel}
                                </span>
                              </div>
                            </div>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${riskColor} bg-current/10`}>
                              <RiskIcon className={`h-4 w-4 ${riskColor}`} />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="flex items-center justify-between border-t border-border p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="rounded-xl text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Fshi të gjitha
                </Button>
                <Button
                  size="sm"
                  onClick={handleExport}
                  className="rounded-xl gradient-primary text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Eksporto CSV
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
