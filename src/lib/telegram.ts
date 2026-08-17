import type { ListItem, Product } from "./types";
import { formatPackPrice, normalizePackSize, packPrice } from "./pricing";

export const TELEGRAM_HANDLE = "Storea420";

export interface OrderLine {
  product: Product;
  quantity: number;
}

export function buildOrderLines(items: ListItem[], products: Product[]): OrderLine[] {
  return items
    .map((i) => {
      const product = products.find((p) => p.id === i.productId);
      return product ? { product, quantity: normalizePackSize(i.quantity) } : null;
    })
    .filter((x): x is OrderLine => x !== null);
}

export function lineTotal(line: OrderLine): number {
  return packPrice(line.product.price_aud, line.quantity) ?? 0;
}

export function ordersTotal(lines: OrderLine[]): number {
  return lines.reduce((s, l) => s + lineTotal(l), 0);
}

export function discountedOrdersTotal(lines: OrderLine[]): number {
  return ordersTotal(lines) * 0.9;
}

function fmt(p: number | null | undefined): string {
  if (p == null) return "Price on request";
  return `A$${p.toFixed(2)}`;
}

export function buildTelegramMessage(lines: OrderLine[], deliveryAddress = "", deliveryMethod: "courier" | "australia_post" = "courier"): string {
  if (lines.length === 0) {
    return "Hello! I'd like to place an order on Vape Spot.";
  }

  const date = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const divider = "─────────────────────────";

  const header = `🛒  NEW ORDER — VAPE SPOT\n📅  ${date}`;

  const productLines = lines
    .map((l, i) => {
      const unit = l.product.price_aud == null ? "Price on request" : fmt(l.product.price_aud);
      const total = l.product.price_aud == null ? "—" : formatPackPrice(lineTotal(l));
      return `${i + 1}. ${l.product.name}\n     ${unit} × pack of ${l.quantity} = ${total}`;
    })
    .join("\n\n");

  const total = ordersTotal(lines);
  const discountedTotal = discountedOrdersTotal(lines);
  const totalsSection = [
    "💰  ORDER TOTALS",
    `    PayID / Bank Transfer: ${fmt(total)} AUD`,
    `    Crypto / Gift Card (10% off): ${fmt(discountedTotal)} AUD`,
  ].join("\n");

  const addressSection = deliveryAddress.trim()
    ? `🚚  DELIVERY ADDRESS\n\n    ${deliveryAddress.trim()}`
    : `🚚  DELIVERY ADDRESS\n\n    Not specified`;

  const deliveryMethodSection = deliveryMethod === "courier"
    ? ["🛵  DELIVERY METHOD", "    Hand-delivered by local courier — usually 30 min–2hrs.", "    (Or via Australia Post if requested.)"].join("\n")
    : ["📮  DELIVERY METHOD", "    Via Australia Post — 1–3 business days, depending on location."].join("\n");

  const payment = [
    "💳  PAYMENT",
    "    PayID or Bank Transfer: standard total.",
    "    Crypto or Gift Card: 10% off the order total.",
    "    Minimum order: A$100.00.",
    "    Payment required before delivery.",
  ].join("\n");

  const footer = "Please reply to confirm this order. Thank you! 🙏";

  return [
    header,
    divider,
    "📦  ORDER\n",
    productLines,
    divider,
    totalsSection,
    divider,
    addressSection,
    divider,
    deliveryMethodSection,
    divider,
    payment,
    divider,
    footer,
  ].join("\n");
}

export function buildTelegramUrl(message: string, handle = TELEGRAM_HANDLE): string {
  return `https://t.me/${handle}?text=${encodeURIComponent(message)}`;
}
