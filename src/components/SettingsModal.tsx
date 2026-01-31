import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Cloud, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [modelName, setModelName] = useState('Xenova/distilbert-base-uncased');
  const [useClientSide, setUseClientSide] = useState(true);
  const [enableWeather, setEnableWeather] = useState(true);

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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-lg border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-xl font-semibold text-foreground">Rregullimet</h2>
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
            <div className="p-6 space-y-6">
              {/* Model Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                    <Cpu className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Modeli AI</h3>
                    <p className="text-xs text-muted-foreground">Konfiguro modelin Hugging Face</p>
                  </div>
                </div>

                <div className="space-y-3 pl-13">
                  <div className="space-y-2">
                    <Label htmlFor="modelName" className="text-sm">
                      Emri i Modelit
                    </Label>
                    <Input
                      id="modelName"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="p.sh. Xenova/distilbert-base-uncased"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Ekzekuto në shfletues</p>
                      <p className="text-xs text-muted-foreground">Përdor transformers.js (pa server)</p>
                    </div>
                    <Switch
                      checked={useClientSide}
                      onCheckedChange={setUseClientSide}
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Kur aktivizohet ekzekutimi në shfletues, modeli do të shkarkohet lokalisht. 
                      Kjo mund të marrë pak kohë herën e parë (madhësia varet nga modeli).
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Configuration */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
                    <Cloud className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Moti</h3>
                    <p className="text-xs text-muted-foreground">Konfiguro integrimin e motit</p>
                  </div>
                </div>

                <div className="space-y-3 pl-13">
                  <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Aktivizo motin</p>
                      <p className="text-xs text-muted-foreground">Shfaq kartelën e motit (Open-Meteo)</p>
                    </div>
                    <Switch
                      checked={enableWeather}
                      onCheckedChange={setEnableWeather}
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Përdorim Open-Meteo si shërbim falas pa nevojë për API key. 
                      Për Google Weather, duhet të konfiguroni API key në backend.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border p-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl"
              >
                Anulo
              </Button>
              <Button
                onClick={onClose}
                className="rounded-xl gradient-primary text-primary-foreground"
              >
                Ruaj Ndryshimet
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
