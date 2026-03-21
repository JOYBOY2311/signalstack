"use client";

import { useState } from "react";
import { getIntentColor, getSourceIcon, timeAgo } from "@/lib/utils";
import type { Signal } from "@/types";

interface Props {
  signal: Signal;
  onAction?: (signalId: string) => void;
}

export function SignalCard({ signal, onAction }: Props) {
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
      className={`bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#2d2d3f] cursor-pointer transition-all ${
        signal.is_actioned
          ? "opacity-50"
          : signal.is_read
          ? "opacity-70"
          : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-4">
        {/* Source icon */}
        <div className="text-2xl mt-0.5">{getSourceIcon(signal.source)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
            {signal.is_actioned && (
              <span className="text-xs text-green-500 font-medium">
                ✓ Actioned
              </span>
            )}
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
              ))}

              {signal.ai_draft_response && (
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-400">
                      AI-Drafted Response
                    </span>
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
                    onClick={(e}) => e.stopPropagation()}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-medium"
                  >
                    Open Original ⚊
                  </a>
                  {!ignal.is_actioned && onAction && (
                    <button
                      onClick={(e}) => {
                        e.stopPropagation();
                        onAction(signal.id);
                      }}
                      className="text-xs text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg border border-green-500/20 hover:bg-green-500/10"
                      >
                      ✓ Mark as Actioned
                    </button>
                  )}
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
