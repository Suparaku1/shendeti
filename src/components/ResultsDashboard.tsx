import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Apple,
  GlassWater,
  Dumbbell,
  Footprints,
  ShieldAlert,
  Stethoscope,
  BookOpen,
  Download,
  ExternalLink,
  Baby,
  UserRound,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { HealthRecommendation, EnvironmentData } from '@/types/health';
import { generatePDF } from '@/services/pdfExport';

interface ResultsDashboardProps {
  recommendation: HealthRecommendation;
  data: EnvironmentData;
  location?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const riskConfig = {
  low: {
    icon: CheckCircle2,
    label: 'Rrezik i Ulët',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success/30',
  },
  medium: {
    icon: AlertCircle,
    label: 'Rrezik Mesatar',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  high: {
    icon: AlertTriangle,
    label: 'Rrezik i Lartë',
    bgClass: 'bg-danger/10',
    textClass: 'text-danger',
    borderClass: 'border-danger/30',
  },
};

function SectionCard({ 
  title, 
  icon: Icon, 
  children,
  className = ''
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`p-5 shadow-card border-0 rounded-2xl gradient-card ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}

export function ResultsDashboard({ recommendation, data, location }: ResultsDashboardProps) {
  const risk = riskConfig[recommendation.riskLevel];
  const RiskIcon = risk.icon;

  const handleDownloadPDF = () => {
    generatePDF(data, recommendation, location);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Risk Level & Summary */}
      <motion.div variants={itemVariants}>
        <Card className={`p-6 shadow-card border rounded-2xl ${risk.bgClass} ${risk.borderClass}`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${risk.bgClass}`}>
              <RiskIcon className={`h-6 w-6 ${risk.textClass}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`text-lg font-bold ${risk.textClass}`}>
                  {risk.label}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="rounded-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Shkarko PDF
                </Button>
              </div>
              <p className="mt-2 text-foreground leading-relaxed">
                {recommendation.summary}
              </p>

              {location && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Lokacioni: {location}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Grid of recommendations */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Food */}
        <SectionCard title="Ushqimi i Rekomanduar" icon={Apple}>
          <ul className="space-y-2">
            {recommendation.food.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-sm text-muted-foreground"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        {/* Drinks */}
        <SectionCard title="Pijet e Rekomanduara" icon={GlassWater}>
          <ul className="space-y-2">
            {recommendation.drinks.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-sm text-muted-foreground"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        {/* Exercises */}
        <SectionCard title="Ushtrimet" icon={Dumbbell}>
          <ul className="space-y-2">
            {recommendation.exercises.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-sm text-muted-foreground"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        {/* Walk Schedule */}
        <SectionCard title="Orari i Ecjeve" icon={Footprints}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.walkSchedule}
          </p>
        </SectionCard>
      </div>

      {/* Precautions */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 shadow-card border-0 rounded-2xl gradient-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <ShieldAlert className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Masa për Grupet Vulnerabël</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm text-foreground">Fëmijët</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation.precautions.children}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm text-foreground">Të Moshuarit</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation.precautions.elderly}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm text-foreground">Astmatikët</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation.precautions.asthmatic}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* When to seek doctor */}
      <SectionCard title="Kur të Kërkoni Mjek" icon={Stethoscope}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendation.seekDoctor}
        </p>
      </SectionCard>

      {/* Sources */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 shadow-card border-0 rounded-2xl gradient-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Burimet & Citimet</h3>
          </div>
          <div className="space-y-3">
            {recommendation.sources.map((source, index) => (
              <motion.a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors group"
              >
                <span className="text-lg">📎</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {source.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {source.date}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            ⚠️ Këshillat e mëposhtme janë për orientim dhe nuk zëvendësojnë konsultën me mjek. 
            Për simptoma të rënda ose emergjenca, konsultoni profesionistin tuaj shëndetësor. 
            Burimet: WHO, CDC, PubMed etj. Shiko seksionin 'Burimet' për lidhjet dhe datat.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
