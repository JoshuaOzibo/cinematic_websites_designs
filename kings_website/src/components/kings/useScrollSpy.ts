import { useEffect, useState, useRef } from "react";

/** Highlights the section id currently closest to the top of the viewport with rAF throttling. */
export function useScrollSpy(ids: string[], offset = 200) {
  const [active, setActive] = useState(ids[0] ?? "");
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        let current = ids[0] ?? "";
        const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

        if (scrollBottom && ids.length > 0) {
          current = ids[ids.length - 1]!;
        } else {
          for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (el.getBoundingClientRect().top - offset <= 0) current = id;
          }
        }

        setActive((prev) => (prev !== current ? current : prev));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [ids, offset]);

  return active;
}
