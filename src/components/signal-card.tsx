"use client";

import { useState } from "react";
import { getIntentColor, getSourceIcon, timeAgo } from "@/lib/utils";
import type { Signal } from "@/types";

const REPLY_GUIDELINES = [
  "Lead with value — answer their question before mentioning your product",
  "Be transparent — disclose that you are the maker if you mention your product",
  "Personalise the draft — generic replies get flagged and downvoted",
  "One reply per thread — over-posting leads to bans on most platforms",
];

export function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

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
            <span className="text-xs text-slate-600">&bull;</span>
            <span className="text-xs text-slate-500">
              {timeAgo(signal.detected_at)}
            </span>
          </div>

          <h4 className="font-medium text-sm mb-1 truncate">{signal.title}</h4>
          <p className="text-sm text-slate-400 line-clamp-2">
            {signal.ai_summary}
          </p>

          {/* Expanded content */}
          {expanded && (
            <div className="mt-4 space-y-3">
              {signal.content && (
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-sm text-slate-400 max-h-40 overflow-y-auto">
                  {signal.content}
                </div>
              )}

              {signal.ai_draft_response && (
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-400">
                      AI-Drafted Response
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGuidelines(!showGuidelines);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-300"
                      >
                        {showGuidelines ? "Hide tips" : "Reply tips"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyDraft();
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        {copied ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Community-safe reply guidelines */}
                  {showGuidelines && (
                    <div className="mb-3 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                      <div className="text-xs font-medium text-amber-400 mb-2">
                        Community-Safe Reply Guidelines
                      </div>
                      <ul className="space-y-1">
                        {REPLY_GUIDELINES.map((g) => (
                          <li
                            key={g}
                            className="text-xs text-slate-400 flex items-start gap-1.5"
                          >
                            <span className="text-amber-400 mt-0.5 flex-shrink-0">
                              &bull;
                            </span>
                            {g}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-slate-500 mt-2 italic">
                        Tip: Always personalise the draft below before posting.
                        Platforms may flag or ban accounts that post repetitive
                        promotional content.
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-slate-300">
                    {signal.ai_draft_response}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <a
                  href={signal.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-medium"
                >
                  Open Original &rarr;
                </a>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-slate-500 hover:text-slate-300 px-3 py-1.5 rounded-lg border border-[#1e1e2e]"
                >
                  Mark as Actioned
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Intent indicator */}
        <div
          className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
            signal.intent_level === "high"
              ? "bg-green-400"
              : signal.intent_level === "medium"
              ? "bg-yellow-400"
              : "bg-slate-600"
          }`}
        />
      </div>
    </div>
  );
}
