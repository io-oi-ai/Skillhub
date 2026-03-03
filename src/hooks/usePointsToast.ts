"use client";

import { useState, useCallback } from "react";

interface ToastState {
  points: number;
  message: string;
}

export function usePointsToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showPointsToast = useCallback((points: number, message: string) => {
    if (points === 0) return;
    setToast({ points, message });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showPointsToast, clearToast };
}
