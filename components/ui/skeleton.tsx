import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        "bg-[#E2E8F0] dark:bg-[#1A1A1D]",
        "after:absolute after:inset-0 after:animate-shimmer after:dark:block after:hidden",
        className
      )}
    >
      {/* Light mode pulse */}
      <span className="absolute inset-0 animate-pulse bg-[#E2E8F0] dark:hidden" />
    </div>
  );
}
