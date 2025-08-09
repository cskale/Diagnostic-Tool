export interface BenchmarkingData {
  oem: string;
  brandStructure: 'single' | 'multi' | '';
  dealerSize: 'small' | 'medium' | 'large' | 'mega' | '';
  affiliation: 'independent' | 'regional' | 'national' | 'oem' | '';
}

export interface BenchmarkOption {
  value: string;
  label: string;
  tooltip: string;
}

export interface BenchmarkCategory {
  name: string;
  options: BenchmarkOption[];
}

export const benchmarkCategories: Record<keyof BenchmarkingData, BenchmarkCategory> = {
  oem: {
    name: 'OEM Level',
    options: [
      { value: 'volkswagen', label: 'Volkswagen Group', tooltip: 'Includes VW, Audi, SEAT and other Volkswagen Group brands.' },
      { value: 'bmw', label: 'BMW Group', tooltip: 'Includes BMW and Mini brands.' },
      { value: 'stellantis', label: 'Stellantis', tooltip: 'PSA and FCA merged group including Peugeot, Citroën, Fiat, etc.' },
      { value: 'mercedes', label: 'Mercedes-Benz Group', tooltip: 'Mercedes-Benz and smart brands.' },
      { value: 'other', label: 'Other OEM', tooltip: 'Any other manufacturer group.' }
    ]
  },
  brandStructure: {
    name: 'Brand Structure',
    options: [
      { value: 'single', label: 'Single Brand', tooltip: 'Retailer representing a single OEM brand.' },
      { value: 'multi', label: 'Multi Brand', tooltip: 'Retailer representing multiple OEM brands at one site.' }
    ]
  },
  dealerSize: {
    name: 'Dealer Size',
    options: [
      { value: 'small', label: 'Small (<250)', tooltip: 'Less than 250 annual new vehicle sales.' },
      { value: 'medium', label: 'Medium (250–500)', tooltip: 'Between 250 and 500 annual new vehicle sales.' },
      { value: 'large', label: 'Large (500–1,000)', tooltip: 'Between 500 and 1,000 annual new vehicle sales.' },
      { value: 'mega', label: 'Mega (>1,000)', tooltip: 'More than 1,000 annual new vehicle sales.' }
    ]
  },
  affiliation: {
    name: 'Dealer Group Affiliation',
    options: [
      { value: 'independent', label: 'Independent Dealer', tooltip: 'Operates without a wider group affiliation.' },
      { value: 'regional', label: 'Regional Dealer Group (2–10 sites)', tooltip: 'Member of a regional network of 2–10 sites.' },
      { value: 'national', label: 'National Dealer Group (>10 sites)', tooltip: 'Member of a national network with more than 10 sites.' },
      { value: 'oem', label: 'OEM-Owned Retail Network', tooltip: 'Retail operation owned directly by the manufacturer.' }
    ]
  }
};

export function maturityScore(data: BenchmarkingData): number {
  let score = 0;
  switch (data.dealerSize) {
    case 'small': score += 1; break;
    case 'medium': score += 2; break;
    case 'large': score += 3; break;
    case 'mega': score += 4; break;
  }
  switch (data.affiliation) {
    case 'independent': score += 1; break;
    case 'regional': score += 2; break;
    case 'national': score += 3; break;
    case 'oem': score += 4; break;
  }
  if (data.brandStructure === 'multi') score += 1;
  return score;
}

export function maturityLevel(score: number): string {
  if (score >= 7) return 'Leading';
  if (score >= 5) return 'Established';
  if (score >= 3) return 'Developing';
  return 'Emerging';
}

export function generateBenchmarkInsights(data: BenchmarkingData): string[] {
  const insights: string[] = [];

  switch (data.dealerSize) {
    case 'small':
      insights.push('You operate as a small dealership, indicating limited scale compared to most peers.');
      break;
    case 'medium':
      insights.push('Your dealership size is medium, comparable to many regional peers.');
      break;
    case 'large':
      insights.push('Your large dealership size places you ahead of smaller competitors.');
      break;
    case 'mega':
      insights.push('As a mega dealership you exceed the capacity of most peers.');
      break;
  }

  switch (data.affiliation) {
    case 'independent':
      insights.push('Operating independently may limit shared resources but allows greater autonomy.');
      break;
    case 'regional':
      insights.push('Regional group affiliation provides some network synergies and benchmarking data.');
      break;
    case 'national':
      insights.push('National group affiliation offers significant support and benchmarking opportunities.');
      break;
    case 'oem':
      insights.push('Being OEM-owned provides direct manufacturer backing and best-practice sharing.');
      break;
  }

  const score = maturityScore(data);
  const level = maturityLevel(score);
  insights.push(`Overall maturity level: ${level}.`);

  return insights;
}

export interface AssessmentSummary {
  score: number;
  level: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function summarizeBenchmark(data: BenchmarkingData): AssessmentSummary {
  const score = maturityScore(data);
  const level = maturityLevel(score);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (data.dealerSize === 'large' || data.dealerSize === 'mega') {
    strengths.push('Operational scale provides market leverage.');
  } else {
    weaknesses.push('Smaller scale than many peers.');
    recommendations.push('Explore growth opportunities to increase sales volume.');
  }

  if (data.affiliation === 'national' || data.affiliation === 'oem') {
    strengths.push('Backed by extensive network resources.');
  } else {
    weaknesses.push('Limited group backing reduces shared resources.');
    recommendations.push('Consider partnerships or affiliations to access support.');
  }

  return { score, level, strengths, weaknesses, recommendations };
}
