import jsPDF from 'jspdf';
import type { EnvironmentData, HealthRecommendation } from '@/types/health';
import { AIR_QUALITY_LABELS } from '@/types/health';

export function generatePDF(
  data: EnvironmentData,
  recommendation: HealthRecommendation,
  location?: string
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(23, 163, 143); // Primary color
  doc.text('HealthAdvisor - Raport Shëndetësor', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Date and location
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleString('sq-AL');
  doc.text(`Data: ${dateStr}${location ? ` | Lokacioni: ${location}` : ''}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Risk level badge
  doc.setFontSize(14);
  const riskColors: Record<string, [number, number, number]> = {
    low: [34, 197, 94],
    medium: [234, 179, 8],
    high: [239, 68, 68],
  };
  const riskLabels: Record<string, string> = {
    low: 'Rrezik i Ulët',
    medium: 'Rrezik Mesatar',
    high: 'Rrezik i Lartë',
  };
  doc.setTextColor(...riskColors[recommendation.riskLevel]);
  doc.text(`Niveli i Rrezikut: ${riskLabels[recommendation.riskLevel]}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Measurements section
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Matjet Mjedisore:', 20, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.text(`• Cilësia e Ajrit: ${AIR_QUALITY_LABELS[data.airQuality]}`, 25, y);
  y += 6;
  doc.text(`• Temperatura: ${data.temperature}°C`, 25, y);
  y += 6;
  doc.text(`• Lagështia: ${data.humidity}%`, 25, y);
  y += 6;
  doc.text(`• Niveli i Gazit: ${data.gasLevel}`, 25, y);
  y += 12;

  // Summary
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Përmbledhje:', 20, y);
  y += 8;
  
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(recommendation.summary.replace(/[⚠️✅⚡]/g, ''), pageWidth - 45);
  doc.text(summaryLines, 25, y);
  y += summaryLines.length * 5 + 8;

  // Helper function to add sections
  const addSection = (title: string, items: string[]) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(title, 20, y);
    y += 8;
    
    doc.setFontSize(9);
    items.forEach(item => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const cleanItem = item.replace(/[🥦🍊🐟🧄🥒🍉🍲🥣🍋🥗🥜💧🧊🥤🍵🫖🏠🧘⚠️🚶🏋️🏃🚴🏊🧗⛔🌅☀️🌤️✨👶👴🫁🏥📎]/g, '');
      const lines = doc.splitTextToSize(`• ${cleanItem}`, pageWidth - 50);
      doc.text(lines, 25, y);
      y += lines.length * 4 + 2;
    });
    y += 5;
  };

  addSection('Ushqimi i Rekomanduar:', recommendation.food);
  addSection('Pijet e Rekomanduara:', recommendation.drinks);
  addSection('Ushtrimet:', recommendation.exercises);
  
  // Walk schedule
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Orari i Ecjeve:', 20, y);
  y += 8;
  doc.setFontSize(9);
  const walkLines = doc.splitTextToSize(recommendation.walkSchedule.replace(/[⛔🌅☀️🌤️✨]/g, ''), pageWidth - 45);
  doc.text(walkLines, 25, y);
  y += walkLines.length * 5 + 10;

  // Precautions
  addSection('Masa për Grupet Vulnerabël:', [
    `Fëmijët: ${recommendation.precautions.children}`,
    `Të moshuarit: ${recommendation.precautions.elderly}`,
    `Astmatikët: ${recommendation.precautions.asthmatic}`,
  ]);

  // Seek doctor
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.text('Kur të Kërkoni Mjek:', 20, y);
  y += 8;
  doc.setFontSize(9);
  const doctorLines = doc.splitTextToSize(recommendation.seekDoctor.replace(/🏥/g, ''), pageWidth - 45);
  doc.text(doctorLines, 25, y);
  y += doctorLines.length * 5 + 10;

  // Sources
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.text('Burimet:', 20, y);
  y += 8;
  doc.setFontSize(8);
  recommendation.sources.forEach(source => {
    if (y > 285) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${source.title} (${source.date})`, 25, y);
    y += 4;
    doc.setTextColor(23, 163, 143);
    doc.text(`  ${source.url}`, 25, y);
    doc.setTextColor(100);
    y += 6;
  });

  // Disclaimer
  y += 5;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(8);
  doc.setTextColor(150);
  const disclaimer = 'Këshillat e mëposhtme janë për orientim dhe nuk zëvendësojnë konsultën me mjek. Për simptoma të rënda ose emergjenca, konsultoni profesionistin tuaj shëndetësor.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, y);

  // Save
  doc.save(`healthadvisor-raport-${new Date().toISOString().split('T')[0]}.pdf`);
}
