export const PACK_SIZES = [1, 2, 3, 5, 10] as const;

export type PackSize = (typeof PACK_SIZES)[number];

// These multipliers preserve the requested example for a product priced at A$54.99.
const PACK_MULTIPLIERS: Record<PackSize, number> = {
  1: 1,
  2: 100 / (54.99 * 2),
  3: 130 / (54.99 * 3),
  5: 200 / (54.99 * 5),
  10: 350 / (54.99 * 10),
};

export interface PackOption {
  size: PackSize;
  price: number | null;
  savingsPercent: number;
}

export function isPackSize(value: number): value is PackSize {
  return PACK_SIZES.includes(value as PackSize);
}

export function normalizePackSize(value: number): PackSize {
  if (isPackSize(value)) return value;
  return PACK_SIZES.find((size) => size >= Math.max(1, value)) ?? PACK_SIZES[PACK_SIZES.length - 1];
}

export function previousPackSize(value: number): PackSize {
  const current = normalizePackSize(value);
  const index = PACK_SIZES.indexOf(current);
  return PACK_SIZES[Math.max(0, index - 1)];
}

export function nextPackSize(value: number): PackSize {
  const current = normalizePackSize(value);
  const index = PACK_SIZES.indexOf(current);
  return PACK_SIZES[Math.min(PACK_SIZES.length - 1, index + 1)];
}

export function packPrice(unitPrice: number | null | undefined, size: number): number | null {
  if (unitPrice == null || Number.isNaN(unitPrice)) return null;
  const packSize = normalizePackSize(size);
  if (packSize === 1) return unitPrice;
  return Math.round(unitPrice * packSize * PACK_MULTIPLIERS[packSize]);
}

export function packSavingsPercent(size: number): number {
  const packSize = normalizePackSize(size);
  if (packSize === 1) return 0;
  return Math.round((1 - PACK_MULTIPLIERS[packSize]) * 100);
}

export function getPackOptions(unitPrice: number | null | undefined): PackOption[] {
  return PACK_SIZES.map((size) => ({
    size,
    price: packPrice(unitPrice, size),
    savingsPercent: packSavingsPercent(size),
  }));
}

export function formatPackPrice(price: number | null | undefined): string {
  if (price == null || Number.isNaN(price)) return "Price on request";
  return `A$${Math.round(price)}`;
}
