import { useCallback, useEffect } from "react";

const setRangeBetween = (min: number, max: number) => (number: number) =>
  Math.min(Math.max(number, min), max);

const useHideOnScroll = (
  cb: (diff: number) => void,
  ref: React.RefObject<HTMLElement>
) => {
  const limitTransformFor = setRangeBetween(0, ref.current?.clientHeight || 53);
  let lastScrollY = 0;
  const handleNavigation = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY;
    let navTransform = parseInt(
      ref.current!.style.transform.replace(/[^0-9\.]/g, ""),
      10
    );
    let diff = limitTransformFor(navTransform - (lastScrollY - scrollY));
    if (scrollY >= lastScrollY) {
      cb(diff > 0 ? diff : limitTransformFor(scrollY));
    } else {
      cb(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    lastScrollY = scrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);
};

export default useHideOnScroll;
