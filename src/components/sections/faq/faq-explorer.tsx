"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

import { FAQ_CATEGORIES } from "./data";
import {
  FaqCategoryTabs,
  panelId,
  tabId,
} from "./faq-category-tabs";
import { FaqItem } from "./faq-item";

type FaqExplorerProps = {
  /** Rendered under the tabs on desktop and under the answers on mobile. */
  aside: ReactNode;
};

/**
 * The interactive part of the FAQ: a category rail beside an accordion.
 * One category is active at a time and one question is open at a time. Picking
 * another category opens its first question, so the panel never looks empty.
 *
 * Layout: on mobile it stacks (tabs, answers, aside). From `lg` the tabs and
 * the aside share the left four columns, and the answers take the right eight.
 */
export function FaqExplorer({ aside }: FaqExplorerProps) {
  const reduceMotion = useReducedMotion();
  const idPrefix = useId();

  const [activeId, setActiveId] = useState(FAQ_CATEGORIES[0].id);
  const [openId, setOpenId] = useState<string | null>(
    FAQ_CATEGORIES[0].items[0].id,
  );
  // The first list is already revealed by the section; only later category
  // changes crossfade.
  const [crossfade, setCrossfade] = useState(false);

  const activeCategory =
    FAQ_CATEGORIES.find((category) => category.id === activeId) ??
    FAQ_CATEGORIES[0];

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    const next = FAQ_CATEGORIES.find((category) => category.id === id);
    if (!next) return;
    setCrossfade(true);
    setActiveId(next.id);
    setOpenId(next.items[0].id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6">
      <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
        <FaqCategoryTabs
          categories={FAQ_CATEGORIES}
          activeId={activeCategory.id}
          onSelect={handleSelect}
          idPrefix={idPrefix}
        />
      </div>

      <div
        role="tabpanel"
        id={panelId(idPrefix)}
        aria-labelledby={tabId(idPrefix, activeCategory.id)}
        className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:min-h-[32rem]"
      >
        <motion.ul
          key={activeCategory.id}
          initial={crossfade && !reduceMotion ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-3"
        >
          {activeCategory.items.map((item) => (
            <li key={item.id}>
              <FaqItem
                item={item}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
                idPrefix={`${idPrefix}-${item.id}`}
              />
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-start">
        {aside}
      </div>
    </div>
  );
}
