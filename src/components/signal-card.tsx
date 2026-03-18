"use client";

import { useState } from "react";
import { getIntentColor, getSourceIcon, timeAgo } from "@/lib/utils";
import type { Signal } from "@/types";

export function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyDraft() {
    if (signal.ai_draft_response) {
      navigator.clipboard.writeText(signal.ai_draft_response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      className={`bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#2d2d3f] cursor-pointer ${
        signal.is_read ? "opacity-70" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-4">
        {/* Source icon */}
        <div className="text-2xl mt-0.5">{getSourceIcon(signal.source)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold border ${getIntentColor(
                signal.intent_level
              )}`}
            >
              {signal.intent_score}% intent
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {signal.source}
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-500">
              {timeAgo(signal.detected_at)}
            </span>
          </div>

          <h4 className="font-medium text-sm mb-1 truncate">
            {signal.title}
          </h4>
          <p className="text-sm text-slate-400 line-clamp-2">
            {signal.ai_summary}
          </p>