import React, { useState } from 'react';
import { PromptItem } from '../types';

interface PromptCardProps {
  prompt: PromptItem;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TEXT': return 'bg-blue-100 text-blue-800';
      case 'IMAGE': return 'bg-purple-100 text-purple-800';
      case 'STRUCTURED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full overflow-hidden group">
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(prompt.type)}`}>
              {prompt.type}
            </span>
            {prompt.for_devs && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                DEV
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-primary-600 transition-colors p-1 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            title="Copy prompt"
            aria-label="Copy prompt to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
          {prompt.act}
        </h3>

        <div className={`relative ${expanded ? '' : 'max-h-32 overflow-hidden'}`}>
          <p className="text-slate-600 text-sm whitespace-pre-wrap font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
            {prompt.prompt}
          </p>
          {!expanded && prompt.prompt.length > 150 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
          )}
        </div>

        {prompt.prompt.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700 self-start focus:outline-none"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="truncate max-w-[120px]" title={prompt.contributor}>
              @{prompt.contributor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};