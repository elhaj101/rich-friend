"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function PageHeading({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-start justify-between gap-4 flex-wrap mb-8"
    >
      <div>
        <h1
          className="font-serif-dash font-medium text-charcoal"
          style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.1 }}
        >
          {title}
        </h1>
        {sub && (
          <p className="mt-2 font-sans text-[14px] leading-[1.6] text-charcoal/60 max-w-[560px]">
            {sub}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
