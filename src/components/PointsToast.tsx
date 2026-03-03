"use client";

import { useEffect, useState } from "react";

interface PointsToastProps {
  points: number;
  message: string;
  onDone: () => void;
}

export default function PointsToast({ points, message, onDone }: PointsToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // wait for fade-out
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const sign = points > 0 ? "+" : "";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] rounded-lg border border-border bg-bg-card px-4 py-3 shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <p className="text-sm font-medium text-text-primary">
        <span className={points > 0 ? "text-green-500" : "text-red-400"}>
          {sign}{points}
        </span>{" "}
        {message}
      </p>
    </div>
  );
}
