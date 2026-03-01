"use client";

import { useState, useEffect, useCallback } from "react";
import { getVisitorId } from "@/lib/visitor";

export function useLike(skillId: string, initialCount: number) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    fetch(`/api/likes/${skillId}?visitor_id=${visitorId}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setLiked(data.liked);
      })
      .catch(() => {});
  }, [skillId]);

  const toggle = useCallback(async () => {
    if (loading) return;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    // Optimistic update
    const prevCount = count;
    const prevLiked = liked;
    setCount((c) => (liked ? c - 1 : c + 1));
    setLiked((l) => !l);
    setLoading(true);

    try {
      const res = await fetch(`/api/likes/${skillId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
      const data = await res.json();
      setCount(data.count);
      setLiked(data.liked);
    } catch {
      // Rollback on failure
      setCount(prevCount);
      setLiked(prevLiked);
    } finally {
      setLoading(false);
    }
  }, [skillId, count, liked, loading]);

  return { count, liked, loading, toggle };
}
