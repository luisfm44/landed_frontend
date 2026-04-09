"use client";

import { useState, useEffect } from "react";

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

interface AuctionTimerProps {
  endsAt: string;
  timeLeftLabel: string;
  endedLabel: string;
}

export function AuctionTimer({
  endsAt,
  timeLeftLabel,
  endedLabel,
}: AuctionTimerProps) {
  // null on the first render (server + client hydration) to avoid mismatch.
  // The real value is set in useEffect — client-only, after hydration.
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const calc = () => new Date(endsAt).getTime() - Date.now();
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  // Render nothing until hydrated — avoids flicker and mismatch
  if (timeLeft === null) return null;

  if (timeLeft <= 0) {
    return <span className="text-danger font-semibold">{endedLabel}</span>;
  }

  const isUrgent = timeLeft < 3_600_000;
  const isCritical = timeLeft < 600_000;

  return (
    <span
      className={
        isCritical
          ? "font-semibold text-danger"
          : isUrgent
          ? "font-semibold text-warning"
          : "text-gray-500 dark:text-muted-foreground"
      }
    >
      {formatTimeLeft(timeLeft)} {timeLeftLabel}
    </span>
  );
}
