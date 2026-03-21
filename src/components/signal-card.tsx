'use client';

import { useState } from 'react';
import { Signal } from '@/types';

interface SignalCardProps {
  signal: Signal;
  onAction?: (signalId: string) => void;
}

const intentColors: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  high: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    text: 'text-emerald-400',
  },
  medium: {
    bg: 'bg-yellow-500/5',
    border: 'border-yellow-500/20',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    text: 'text-yellow-400',
  },
  low: {
    bg: 'bg-slate-500/5',
    border: 'border-slate-500/20',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    text: 'text-slate-400',
  },
};

const sourceIcons: Record<string, string> = {
  reddit: '🔴',
  hackernews: '🟠',
  twitter: '🐦',
  stackoverflow: '📚',
  github: '🐙',
  indiehackers: '💡',
  devto: '📝',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function SignalCard({ signal, onAction }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actioning, setActioning] = useState(false);

  const colors = intentColors[signal.intent_level] || intentColors.low;
  const sourceIcon = sourceIcons[signal.source] || '🔍';

  const handleCopyDraft = async () => {
    if (signal.ai_draft_response) {
      await navigator.clipboard.writeText(signal.ai_draft_response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = async () => {
    if (onAction && !actioning) {
      setActioning(true);
      try {
        await onAction(signal.id);
      } catch {
        // ignore
      }
      setActioning(false);
    }
  };

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-xl p-5 transition-all hover:border-opacity-40`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg flex-shrink-0">{sourceIcon}</span>
          <h3
            className="font-medium text-white truncate cursor-pointer hover:text-indigo-300 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {signal.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
            {signal.intent_level}
          </span>
          <span className={`text-xs font-mono ${colors.text}`}>
            {signal.intent_score}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span className="capitalize">{signal.source}</span>
        <span>·</span>
        <span>{signal.author}</span>
        <span>·</span>
        <span>{timeAgo(signal.detected_at)}</span>
        {signal.is_actioned && (
          <>
            <span>·</span>
            <span className="text-emerald-500">✓ Actioned</span>
          </>
        )}
      </div>

      {/* AI Summary */}
      <p className="text-sm text-slate-300 mb-3 leading-relaxed">
        {signal.ai_summary}
      </p>

      {/* Expandable Content */}
      {expanded && (
        <div className="space-y-3 mb-3">
          <div className="bg-[#0a0a0f] rounded-lg p-4 text-sm text-slate-400 max-h-40 overflow-y-auto">
            {signal.content}
          </div>

          {signal.ai_draft_response && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-indigo-400">AI Draft Response</span>
                <button
                  onClick={handleCopyDraft}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <p className="text-sm text-slate-300">{signal.ai_draft_response}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={signal.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Original →
        </a>
        <div className="flex-1" />
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
        {!signal.is_actioned && (
          <button
            onClick={handleAction}
            disabled={actioning}
            className="text-xs px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors border border-indigo-600/20 disabled:opacity-50"
          >
            {actioning ? 'Marking...' : '✓ Mark Actioned'}
          </button>
        )}
      </div>
    </div>
  );
}
