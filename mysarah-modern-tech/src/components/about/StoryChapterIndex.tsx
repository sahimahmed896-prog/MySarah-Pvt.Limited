"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChapterItem {
  id: string;
  label: string;
}

interface StoryChapterIndexProps {
  items: ChapterItem[];
}

export default function StoryChapterIndex({ items }: StoryChapterIndexProps) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");
  const { t } = useTranslation();

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0.15, 0.4, 0.7],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return (
    <nav className="story-chapter-index" aria-label={t("Our story chapter navigation")}>
      <ul>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} className={active ? "is-active" : ""}>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
