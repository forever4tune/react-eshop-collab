import { useEffect, useRef, useState } from "react";

export default function useInfiniteScroll<T>(items: T[], pageSize = 12) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, items.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(pageSize, items.length));
  }, [items, pageSize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sentinelRef.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
        }
      });
    };

    observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(el);

    return () => {
      if (observer && el) observer.unobserve(el);
      observer = null;
    };
    // we intentionally don't include `items` (the array reference may change frequently)
    // only depend on `items.length` so the observer resets when list size changes
  }, [items.length, pageSize]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return { visibleItems, sentinelRef, hasMore };
}
