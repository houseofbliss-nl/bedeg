import type { Product } from "@/lib/types";
import { formatPackPrice, getPackOptions } from "@/lib/pricing";

export function PackPricing({
  product,
  compact = false,
}: {
  product: Pick<Product, "price_aud">;
  compact?: boolean;
}) {
  const packs = getPackOptions(product.price_aud).slice(1);

  return (
    <div className={compact ? "mt-2 space-y-1.5" : "space-y-2.5"}>
      <span className="inline-flex items-center rounded-full bg-[#EDE9FF] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5B3DF5]">
        Pack savings
      </span>
      <div className={compact ? "grid grid-cols-2 gap-1 w-full" : "grid grid-cols-2 md:grid-cols-4 gap-2"}>
        {packs.map((pack) => (
          <span
            key={pack.size}
            className="inline-flex min-w-0 items-center gap-1 rounded-md border border-[#DDD6FF] bg-white px-1.5 py-1 text-[9px] font-bold text-[#1F1F1F] whitespace-nowrap"
          >
            <span>Pack {pack.size}</span>
            <span className="text-[#5B3DF5]">{formatPackPrice(pack.price)}</span>
            <span className="text-[#5B3DF5]">-{pack.savingsPercent}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
