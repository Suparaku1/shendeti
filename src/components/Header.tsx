import { motion } from 'framer-motion';
import { Settings, History, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
}

export function Header({ onSettingsClick, onHistoryClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Këshilluesi nga Shpë</h1>
            <p className="text-xs text-muted-foreground">Këshilla shëndetësore</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHistoryClick}
            className="rounded-xl hover:bg-secondary"
            aria-label="Historiku i matjeve"
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="rounded-xl hover:bg-secondary"
            aria-label="Rregullimet"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
