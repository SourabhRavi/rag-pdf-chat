import { useLayoutEffect, useState } from "react";

export const useIsOverflowing = (
  ref: React.RefObject<HTMLElement | null>,
  maxHeight: number,
  dependency?: unknown,
) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const check = () => {
      setIsOverflowing(element.scrollHeight > maxHeight);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, maxHeight, dependency]);

  return isOverflowing;
};
