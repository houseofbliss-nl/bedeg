import { Minus, Plus } from "lucide-react";
import { nextPackSize, previousPackSize } from "@/lib/pricing";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  steps,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  steps?: readonly number[];
}) {
  const usePackSteps = Boolean(steps?.length);
  return (
    <div className="inline-flex items-center border border-[#E8E8E8] rounded-none overflow-hidden h-11">
      <button
        type="button"
        onClick={() => onChange(usePackSteps ? previousPackSize(value) : Math.max(min, value - 1))}
        aria-label="Decrease"
        className="w-10 h-full flex items-center justify-center hover:bg-[#F5F5F7]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-[15px] font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(usePackSteps ? nextPackSize(value) : value + 1)}
        aria-label="Increase"
        className="w-10 h-full flex items-center justify-center hover:bg-[#F5F5F7]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
