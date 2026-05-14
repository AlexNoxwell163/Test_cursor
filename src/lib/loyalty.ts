import type { LoyaltyProfile, LoyaltyTier } from "@/types";

const STORAGE_KEY = "barbershop:loyalty-profiles";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const TIERS: LoyaltyTier[] = [
  { id: "base", name: "Гость", minPoints: 0, discountPercent: 0 },
  { id: "silver", name: "Серебро", minPoints: 400, discountPercent: 3 },
  { id: "gold", name: "Золото", minPoints: 1000, discountPercent: 5 },
  { id: "platinum", name: "Платина", minPoints: 2200, discountPercent: 8 },
];

/** Синтетический рейтинг + ваши баллы — для демонстрации «топа» в одном браузере. */
const MOCK_LEADERBOARD: { name: string; points: number }[] = [
  { name: "Мария В.", points: 3100 },
  { name: "Дмитрий С.", points: 2650 },
  { name: "Елена К.", points: 2100 },
  { name: "Игорь П.", points: 1880 },
  { name: "Ольга Н.", points: 1420 },
];

function readMap(): Record<string, LoyaltyProfile> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, LoyaltyProfile>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, LoyaltyProfile>): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getTierForPoints(points: number): LoyaltyTier {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (points >= t.minPoints) current = t;
  }
  return current;
}

export function getLoyaltyProfile(userId: string): LoyaltyProfile {
  const map = readMap();
  return (
    map[userId] ?? {
      userId,
      points: 0,
      visits: 0,
      updatedAt: new Date().toISOString(),
    }
  );
}

/** Баллы: ~1 за каждые 100 ₽ итоговой записи + бонус за визит. */
export function addLoyaltyAfterBooking(userId: string, finalPriceRub: number): LoyaltyProfile {
  const map = readMap();
  const prev = map[userId] ?? getLoyaltyProfile(userId);
  const moneyPoints = Math.max(0, Math.floor(finalPriceRub / 100));
  const next: LoyaltyProfile = {
    userId,
    points: prev.points + moneyPoints + 15,
    visits: prev.visits + 1,
    updatedAt: new Date().toISOString(),
  };
  map[userId] = next;
  writeMap(map);
  return next;
}

export type LeaderboardRow = {
  rank: number;
  name: string;
  points: number;
  isYou?: boolean;
};

export function buildLeaderboard(yourUserId: string | null, yourName: string): LeaderboardRow[] {
  const yourProfile = yourUserId ? getLoyaltyProfile(yourUserId) : null;
  const yourPoints = yourProfile?.points ?? 0;

  const rows: { name: string; points: number; isYou?: boolean }[] = MOCK_LEADERBOARD.map(
    (m) => ({ ...m }),
  );

  if (yourUserId) {
    rows.push({ name: `${yourName} (вы)`, points: yourPoints, isYou: true });
  }

  rows.sort((a, b) => b.points - a.points);

  return rows.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    points: r.points,
    isYou: r.isYou,
  }));
}

/** Доп. бонус лидеру рейтинга в этом списке (демо). */
export function getTopLoyaltyBonusPercent(
  yourUserId: string | null,
  yourName: string,
): number {
  if (!yourUserId) return 0;
  const board = buildLeaderboard(yourUserId, yourName);
  const top = board[0];
  if (top?.isYou) return 2;
  return 0;
}

export function getDiscountBreakdown(
  userId: string | null,
  displayName: string,
): {
  tier: LoyaltyTier;
  tierDiscount: number;
  topBonus: number;
  totalPercent: number;
} {
  if (!userId) {
    return {
      tier: TIERS[0],
      tierDiscount: 0,
      topBonus: 0,
      totalPercent: 0,
    };
  }
  const profile = getLoyaltyProfile(userId);
  const tier = getTierForPoints(profile.points);
  const topBonus = getTopLoyaltyBonusPercent(userId, displayName);
  const totalPercent = Math.min(12, tier.discountPercent + topBonus);
  return { tier, tierDiscount: tier.discountPercent, topBonus, totalPercent };
}
