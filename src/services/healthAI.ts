import type { EnvironmentData, HealthRecommendation, AirQuality, Source } from '@/types/health';
import { AIR_QUALITY_LABELS } from '@/types/health';

// Knowledge base for health recommendations
const HEALTH_SOURCES: Source[] = [
  {
    title: "WHO Air Quality Guidelines",
    url: "https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health",
    date: "2024-01-15"
  },
  {
    title: "CDC - Air Quality and Health",
    url: "https://www.cdc.gov/air-quality/about/health-effects-of-poor-air-quality.html",
    date: "2024-02-20"
  },
  {
    title: "ECDC - Environmental Health Guidance",
    url: "https://www.ecdc.europa.eu/en/climate-change",
    date: "2024-03-10"
  },
  {
    title: "PubMed - Effects of Temperature on Health",
    url: "https://pubmed.ncbi.nlm.nih.gov/temperature-health-effects",
    date: "2023-12-05"
  },
];

function calculateRiskLevel(data: EnvironmentData): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Air quality contribution
  const airScores: Record<AirQuality, number> = {
    very_good: 0,
    good: 1,
    bad: 3,
    very_bad: 5,
  };
  riskScore += airScores[data.airQuality];

  // Temperature contribution
  if (data.temperature < 5 || data.temperature > 35) {
    riskScore += 3;
  } else if (data.temperature < 10 || data.temperature > 30) {
    riskScore += 2;
  } else if (data.temperature < 15 || data.temperature > 28) {
    riskScore += 1;
  }

  // Humidity contribution
  if (data.humidity < 20 || data.humidity > 80) {
    riskScore += 2;
  } else if (data.humidity < 30 || data.humidity > 70) {
    riskScore += 1;
  }

  // Gas level contribution
  if (data.gasLevel > 500) {
    riskScore += 4;
  } else if (data.gasLevel > 300) {
    riskScore += 2;
  } else if (data.gasLevel > 150) {
    riskScore += 1;
  }

  if (riskScore >= 8) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
}

function getFoodRecommendations(data: EnvironmentData, riskLevel: 'low' | 'medium' | 'high'): string[] {
  const foods: string[] = [];

  // Based on air quality
  if (data.airQuality === 'bad' || data.airQuality === 'very_bad') {
    foods.push('🥦 Perime të gjelbra të pasura me antioksidantë (brokoli, spinaq)');
    foods.push('🍊 Fruta me vitamin C (portokall, kivi, dredhëza)');
    foods.push('🐟 Peshk i pasur me omega-3 (salmon, sardele)');
    foods.push('🧄 Hudhra dhe qepë për forcimin e sistemit imunitar');
  }

  // Based on temperature
  if (data.temperature > 28) {
    foods.push('🥒 Perime me ujë (kastravec, domate, sallate)');
    foods.push('🍉 Fruta të freskëta (shalqi, pjepër)');
  } else if (data.temperature < 10) {
    foods.push('🍲 Supa të ngrohta me perime');
    foods.push('🥣 Ushqime energjike (tërshërë, lidhje të thata)');
  }

  // Based on humidity
  if (data.humidity > 70) {
    foods.push('🍋 Ushqime me veti kundër-inflamatore (xhenxhefil, limon)');
  }

  if (foods.length === 0) {
    foods.push('🥗 Dieta e balancuar me perime dhe fruta të freskëta');
    foods.push('🥜 Fruta të thata dhe arrorë për energji');
  }

  return foods;
}

function getDrinkRecommendations(data: EnvironmentData): string[] {
  const drinks: string[] = [];

  drinks.push('💧 Ujë i bollshëm (të paktën 2 litra në ditë)');

  if (data.temperature > 25) {
    drinks.push('🧊 Ujë me limon dhe mentë të ftohtë');
    drinks.push('🥤 Lëngje frutash pa sheqer të shtuar');
  }

  if (data.airQuality === 'bad' || data.airQuality === 'very_bad') {
    drinks.push('🍵 Çaj jeshil me antioksidantë');
    drinks.push('🫖 Çaj me xhenxhefil dhe mjaltë');
  }

  if (data.humidity < 40) {
    drinks.push('🫖 Infuzione bimore hidratuese');
  }

  return drinks;
}

function getExerciseRecommendations(data: EnvironmentData, riskLevel: 'low' | 'medium' | 'high'): string[] {
  const exercises: string[] = [];

  if (riskLevel === 'high') {
    exercises.push('🏠 Ushtrime të lehta brenda (joga, stretching)');
    exercises.push('🧘 Ushtrime frymëmarrjeje të thella');
    exercises.push('⚠️ Shmangni aktivitetin fizik jashtë');
  } else if (riskLevel === 'medium') {
    exercises.push('🚶 Ecje e lehtë në orët e mëngjesit ose mbrëmjes');
    exercises.push('🏋️ Ushtrime të moderuara në ambiente të mbyllura');
    exercises.push('🧘 Joga ose pilates');
  } else {
    exercises.push('🏃 Vrapim ose ecje e shpejtë');
    exercises.push('🚴 Çiklizëm në natyrë');
    exercises.push('🏊 Not (nëse ka pishinë)');
    exercises.push('🧗 Aktivitete në natyrë');
  }

  return exercises;
}

function getWalkSchedule(data: EnvironmentData, riskLevel: 'low' | 'medium' | 'high'): string {
  if (riskLevel === 'high') {
    return '⛔ Rekomandohet të qëndroni brenda. Nëse duhet të dilni, bëni këtë vetëm për nevoja urgjente dhe për kohë të shkurtër (15-20 minuta).';
  }

  if (data.temperature > 30) {
    return '🌅 Orari optimal: 06:00-09:00 në mëngjes ose 19:00-21:00 në mbrëmje. Shmangni orët e nxehta 11:00-17:00.';
  }

  if (data.temperature < 5) {
    return '☀️ Orari optimal: 11:00-15:00 kur temperatura është më e lartë. Vishuni ngrohtë dhe qëndroni në lëvizje.';
  }

  if (data.airQuality === 'bad') {
    return '🌤️ Ecni herët në mëngjes (06:00-08:00) kur niveli i ndotjes është më i ulët. Shmangni zonat me trafik.';
  }

  return '✨ Çdo orë e ditës është e përshtatshme për ecje. Rekomandohet të paktën 30 minuta ecje ditore.';
}

function getPrecautions(data: EnvironmentData, riskLevel: 'low' | 'medium' | 'high') {
  return {
    children: riskLevel === 'high' 
      ? '👶 Fëmijët duhet të qëndrojnë brenda. Siguroni ajrosje të mirë në ambiente. Shmangni lojërat jashtë.'
      : riskLevel === 'medium'
      ? '👶 Kufizoni kohën e lojërave jashtë. Sigurohuni që fëmijët të pinë ujë të mjaftueshëm.'
      : '👶 Fëmijët mund të luajnë normalisht jashtë. Siguroni hidratim të mirë.',
    
    elderly: riskLevel === 'high'
      ? '👴 Personat e moshuar duhet të qëndrojnë në ambiente të mbyllura me ajër të pastër. Kontrolloni shëndetin rregullisht.'
      : riskLevel === 'medium'
      ? '👴 Kufizoni aktivitetet jashtë. Merrni ilaçet rregullisht dhe qëndroni të hidratuar.'
      : '👴 Aktivitete normale me kujdes për temperaturën. Ecje e lehtë është e rekomanduar.',
    
    asthmatic: riskLevel === 'high'
      ? '🫁 Mbani inhalatorin pranë. Shmangni çdo ekspozim ndaj ajrit të jashtëm. Përdorni maska N95 nëse dilni.'
      : riskLevel === 'medium'
      ? '🫁 Mbani inhalatorin pranë gjatë aktiviteteve. Shmangni zonat me trafik të rëndë.'
      : '🫁 Mund të bëni aktivitete normale duke pasur inhalatorin pranë si masë paraprake.',
  };
}

function getSeekDoctorAdvice(data: EnvironmentData, riskLevel: 'low' | 'medium' | 'high'): string {
  if (riskLevel === 'high') {
    return '🏥 Konsultoni mjekun nëse përjetoni: vështirësi në frymëmarrje, dhimbje gjoksi, marramendje, kollë të vazhdueshme, ose çdo simptomë të pazakontë. Për emergjenca, telefononi 127.';
  }

  if (riskLevel === 'medium') {
    return '🏥 Kërkoni ndihmë mjekësore nëse keni simptoma të vazhdueshme si kollë, irritim të syve, ose lodhje të pazakontë që zgjat më shumë se 2-3 ditë.';
  }

  return '🏥 Kontrollohuni tek mjeku rregullisht. Kërkoni ndihmë nëse vëreni simptoma të reja ose të pazakonta.';
}

export async function generateHealthRecommendation(
  data: EnvironmentData,
  location?: string
): Promise<HealthRecommendation> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  const riskLevel = calculateRiskLevel(data);
  const airLabel = AIR_QUALITY_LABELS[data.airQuality];

  const summaryParts: string[] = [];
  
  if (riskLevel === 'high') {
    summaryParts.push(`⚠️ Rrezik i lartë!${location ? ` Në zonën tuaj (${location}),` : ''} me cilësinë e ajrit "${airLabel}", temperaturë ${data.temperature}°C, lagështi ${data.humidity}% dhe nivel gazi ${data.gasLevel}, rekomandohet të merrni masa mbrojtëse urgjente.`);
  } else if (riskLevel === 'medium') {
    summaryParts.push(`⚡ Rrezik mesatar.${location ? ` Në zonën tuaj (${location}),` : ''} kushtet aktuale (ajri: ${airLabel}, temp: ${data.temperature}°C) kërkojnë kujdes të veçantë, sidomos për grupet vulnerabël.`);
  } else {
    summaryParts.push(`✅ Kushte të favorshme!${location ? ` Në zonën tuaj (${location}),` : ''} me ajër "${airLabel}" dhe temperaturë ${data.temperature}°C, mund të shijoni aktivitete normale jashtë.`);
  }

  return {
    summary: summaryParts.join(' '),
    riskLevel,
    food: getFoodRecommendations(data, riskLevel),
    drinks: getDrinkRecommendations(data),
    exercises: getExerciseRecommendations(data, riskLevel),
    walkSchedule: getWalkSchedule(data, riskLevel),
    precautions: getPrecautions(data, riskLevel),
    seekDoctor: getSeekDoctorAdvice(data, riskLevel),
    sources: HEALTH_SOURCES,
  };
}
