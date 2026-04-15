"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreMeta {
  label: string;
  bar: string;
  track: string;
  text: string;
  numBg: string;
}

function getScoreMeta(score: number): ScoreMeta {
  if (score >= 85)
    return {
      label: "Excelente oportunidad",
      bar: "bg-emerald-500",
      track: "bg-emerald-100 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-400",
      numBg: "bg-emerald-100 dark:bg-emerald-900/40",
    };
  if (score >= 70)
    return {
      label: "Buena opción",
      bar: "bg-amber-400",
      track: "bg-amber-100 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      numBg: "bg-amber-100 dark:bg-amber-900/40",
    };
  return {
    label: "Menor prioridad",
    bar: "bg-gray-400 dark:bg-[#52525B]",
    track: "bg-[#E2E8F0] dark:bg-[#26262B]",
    text: "text-[#64748B] dark:text-[#71717A]",
    numBg: "bg-[#F1F5F9] dark:bg-[#1A1A1D]",
  };
}

export function ScoreBar({ score }: { score: number }) {
  const [progress, setProgress] = useState(0);
  const meta = getScoreMeta(score);

  useEffect(() => {
    const id = setTimeout(() => setProgress(score), 150);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <div className="flex items-center gap-3">
      {/* score number */}
      <div
        className={cn(
          "text-xl font-bold px-3 py-1.5 rounded-lg tabular-nums shrink-0 leading-none",
          meta.numBg,
          meta.text
        )}
      >
        {score}
      </div>

      {/* label + bar + sub-caption */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className={cn("text-xs font-semibold leading-none", meta.text)}>
          {meta.label}
        </span>
        <div className={cn("h-1.5 rounded-full overflow-hidden", meta.track)}>
          <div
            className={cn("h-full rounded-full transition-[width] duration-700 ease-out", meta.bar)}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-[#94A3B8] dark:text-[#71717A] leading-none">
          Precio · demanda · ahorro
        </p>
      </div>
    </div>
  );
}
