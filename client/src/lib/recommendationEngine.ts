import { Racket, rackets } from '@/data/rackets';
import { TennisString, strings } from '@/data/strings';

type Answers = Record<string, { value?: string; text?: string; type?: string; attributes?: Array<{ key: string; default: number; min: number; max: number }> }>;

const racquetAttributeKeys = ["power", "control", "spin", "maneuverability", "feel", "stability", "comfort", "forgiveness"] as const;
const stringAttributeKeys = ["power", "control", "spin", "comfort", "durability", "feel", "tension_stability"] as const;

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

// ─── RACKET ENGINE ───────────────────────────────────────────────────────────

function buildPlayerProfile(answers: Answers) {
  const weights: Record<string, number> = {};
  racquetAttributeKeys.forEach(k => weights[k] = 0.01);

  const feelWeights = answers["feelWeights"]?.attributes || [];
  feelWeights.forEach(attr => {
    const key = attr.key.toLowerCase();
    if (racquetAttributeKeys.includes(key as any)) {
      weights[key] = normalize(attr.default, attr.min, attr.max);
    }
  });

  let total = Object.values(weights).reduce((s, w) => s + w, 0);
  if (total > 0) Object.keys(weights).forEach(k => weights[k] /= total);

  const prefs = {
    level: answers["level"]?.value,
    ageRange: answers["ageRange"]?.value,
    physicality: answers["physicality"]?.value,
    swingStyle: answers["swingStyle"]?.value,
    strokeType: answers["strokeType"]?.value,
    commonMiss: answers["commonMiss"]?.value,
    injuries: answers["injuries"]?.value,
    backhand: answers["backhand"]?.value,
  };

  if (prefs.injuries && prefs.injuries !== "None") {
    weights.comfort = Math.min(1, (weights.comfort || 0.1) * 1.5 + 0.2);
  }
  if (prefs.ageRange === "Senior") {
    weights.comfort = Math.min(1, (weights.comfort || 0.1) * 1.3 + 0.1);
    weights.power = Math.min(1, (weights.power || 0.1) * 1.2);
    weights.maneuverability = Math.min(1, (weights.maneuverability || 0.1) * 1.2);
  }
  if (prefs.commonMiss === "MissLong") weights.control = Math.min(1, (weights.control || 0.1) * 1.4 + 0.15);
  if (prefs.commonMiss === "MissNet") weights.power = Math.min(1, (weights.power || 0.1) * 1.4 + 0.15);
  if (prefs.strokeType === "Topspin") weights.spin = Math.min(1, (weights.spin || 0.1) * 1.3 + 0.1);

  total = Object.values(weights).reduce((s, w) => s + w, 0);
  if (total > 0) Object.keys(weights).forEach(k => weights[k] /= total);

  return { weights, preferences: prefs };
}

function createIdealVector(profile: ReturnType<typeof buildPlayerProfile>) {
  const v: Record<string, number> = {};
  racquetAttributeKeys.forEach(k => v[k] = 0.5);
  const p = profile.preferences;

  if (p.swingStyle === "Short-Compact" || p.commonMiss === "MissNet") v.power = 0.8;
  else if (p.swingStyle === "Fast-Full") v.power = 0.3;

  if (p.swingStyle === "Fast-Full" || p.commonMiss === "MissLong") v.control = 0.9;
  else v.control = 0.6;

  if (p.injuries !== "None" || p.ageRange === "Senior") v.comfort = 0.9;
  if (p.level === "Beginner") v.forgiveness = 0.8;
  if (p.physicality === "Strong" || p.level === "Advanced") v.stability = 0.8;
  if (p.physicality === "Light" || p.backhand === "One-handed") v.maneuverability = 0.8;

  return v;
}

function scoreRacket(racket: Racket, idealVector: Record<string, number>, weights: Record<string, number>, prefs: ReturnType<typeof buildPlayerProfile>['preferences']): number {
  let dist = 0;
  racquetAttributeKeys.forEach(key => {
    const rv = (racket as any)[key] || 0.5;
    const iv = idealVector[key];
    const w = weights[key] || 0.1;
    dist += w * Math.pow(rv - iv, 2);
  });

  let score = Math.max(0, 100 * (1 - Math.sqrt(dist)));

  if (racket.playerLevel.includes(prefs.level || '')) score += 5;
  else score -= 5;

  if (prefs.injuries !== "None" && racket.stiffness > 68) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export interface RacketResult extends Racket {
  score: number;
  rank: number;
  matchDetails: Record<string, { racket: number; ideal: number; matchPct: number }>;
}

export function generateRacketRecommendations(answers: Answers): RacketResult[] {
  const profile = buildPlayerProfile(answers);
  const idealVector = createIdealVector(profile);

  const scored = rackets
    .filter(r => {
      if (profile.preferences.level === "Beginner" && r.playerLevel.includes("Advanced")) return false;
      if (profile.preferences.level === "Advanced" && r.playerLevel.length === 1 && r.playerLevel.includes("Beginner")) return false;
      return true;
    })
    .map(r => ({ ...r, rawScore: scoreRacket(r, idealVector, profile.weights, profile.preferences) }))
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 5);

  return scored.map((r, i) => ({
    ...r,
    score: Math.round(r.rawScore),
    rank: i + 1,
    matchDetails: Object.fromEntries(
      racquetAttributeKeys.map(key => [key, {
        racket: (r as any)[key] || 0.5,
        ideal: idealVector[key],
        matchPct: Math.round(100 * (1 - Math.abs(((r as any)[key] || 0.5) - idealVector[key]))),
      }])
    ),
  }));
}

// ─── STRING ENGINE ────────────────────────────────────────────────────────────

function buildStringProfile(answers: Answers) {
  const weights: Record<string, number> = {};
  stringAttributeKeys.forEach(k => weights[k] = 0.01);

  const feel = answers["stringFeel"]?.value;
  if (feel === "Soft") { weights.comfort = 0.8; weights.power = 0.6; }
  else if (feel === "Crisp") { weights.control = 0.8; weights.feel = 0.7; }

  const priority = answers["priority"]?.value;
  if (priority) {
    const key = priority.toLowerCase();
    if (stringAttributeKeys.includes(key as any)) {
      weights[key] = Math.min(1, (weights[key] || 0.1) + 0.5);
    }
  }

  const prefs = {
    level: answers["level"]?.value,
    swingStyle: answers["swingStyle"]?.value,
    breakStrings: answers["breakStrings"]?.value,
    armIssues: answers["armIssues"]?.value,
    budget: answers["budget"]?.value,
  };

  if (prefs.armIssues !== "No, I have no arm issues") {
    weights.comfort = Math.min(1, (weights.comfort || 0.1) * 1.6 + 0.3);
  }
  if (prefs.breakStrings === "Yes, frequently") {
    weights.durability = Math.min(1, (weights.durability || 0.1) * 1.5 + 0.2);
  }

  let total = Object.values(weights).reduce((s, w) => s + w, 0);
  if (total > 0) Object.keys(weights).forEach(k => weights[k] /= total);

  return { weights, preferences: prefs };
}

function createIdealStringVector(profile: ReturnType<typeof buildStringProfile>) {
  const v: Record<string, number> = {};
  stringAttributeKeys.forEach(k => v[k] = 0.5);
  const p = profile.preferences;

  if (p.swingStyle === "Fast/Full") { v.control = 0.8; v.power = 0.3; }
  else { v.power = 0.7; v.control = 0.4; }

  if (p.armIssues !== "No, I have no arm issues") v.comfort = 0.9;
  if (p.breakStrings === "Yes, frequently") v.durability = 0.9;

  return v;
}

function scoreString(s: TennisString, idealVector: Record<string, number>, weights: Record<string, number>, prefs: ReturnType<typeof buildStringProfile>['preferences']): number {
  let dist = 0;
  stringAttributeKeys.forEach(key => {
    const sv = (s as any)[key] || 0.5;
    const iv = idealVector[key];
    const w = weights[key] || 0.1;
    dist += w * Math.pow(sv - iv, 2);
  });

  let score = Math.max(0, 100 * (1 - Math.sqrt(dist)));

  if (s.player_level?.includes(prefs.level || '')) score += 5;

  if (prefs.armIssues !== "No, I have no arm issues" && s.material === "Co-polyester") score -= 25;

  const budgetMap: Record<string, number> = { "Up to $15": 15, "$15 - $25": 25, "$25+": Infinity };
  if (prefs.budget && s.price > (budgetMap[prefs.budget] || Infinity)) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export interface StringResult extends TennisString {
  score: number;
  rank: number;
}

export function generateStringRecommendations(answers: Answers): StringResult[] {
  const profile = buildStringProfile(answers);
  const idealVector = createIdealStringVector(profile);

  return strings
    .map(s => ({ ...s, rawScore: scoreString(s, idealVector, profile.weights, profile.preferences) }))
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 5)
    .map((s, i) => ({ ...s, score: Math.round(s.rawScore), rank: i + 1 }));
}
