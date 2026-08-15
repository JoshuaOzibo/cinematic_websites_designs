import { useEffect, useRef, useState, type ReactNode } from "react";

/* ── one observer for the whole page ─────────────────────────
 *
 * Every Reveal used to construct its own IntersectionObserver. That is fine
 * for the handful on the home page and expensive on /menu, which renders one
 * per menu item — 174 separate observers, each a separate set of root bounds
 * for the browser to compute and a separate callback to service on every frame
 * that moves the viewport.
 *
 * All of them wanted identical options, so they can share a single instance:
 * same threshold, same rootMargin, same fire-once-then-drop behaviour. The
 * observer is created lazily inside an effect, so the server never touches it.
 */
const OPTIONS: IntersectionObserverInit = {
  threshold: 0.01,
  rootMargin: "0px 0px 150px 0px",
};

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function unobserve(node: Element) {
  callbacks.delete(node);
  observer?.unobserve(node);
}

function observe(node: Element, onVisible: () => void) {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const fire = callbacks.get(entry.target);
      // Drop the target before firing: this is a one-shot reveal, and leaving
      // it registered would keep it in the observer's per-frame work list for
      // the rest of the session.
      unobserve(entry.target);
      fire?.();
    }
  }, OPTIONS);

  callbacks.set(node, onVisible);
  observer.observe(node);
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    observe(node, () => setVisible(true));
    return () => unobserve(node);
  }, []);

  const Component = Tag as "div";

  return (
    <Component
      ref={ref}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
