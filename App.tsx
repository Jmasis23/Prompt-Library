import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { getPrompts } from './services/csvParser';
import { PromptItem, FilterType } from './types';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading mostly for smoother UX initial render
    const data = getPrompts();
    setPrompts(data);
    setIsLoading(false);
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      const matchesSearch = 
        item.act.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === 'ALL' || 
        item.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [prompts, searchTerm, activeFilter]);

  const stats = useMemo(() => ({
    total: prompts.length,
    devFocused: prompts.filter(p => p.for_devs).length,
    contributors: new Set(prompts.map(p => p.contributor)).size
  }), [prompts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero / Search Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Unlock the power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">AI Prompts</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Discover, search, and use a curated collection of prompts for ChatGPT, Gemini, and other LLMs.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-lg shadow-sm transition-shadow"
              placeholder="Search for prompts (e.g. 'coding', 'writer', 'linux')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {(['ALL', 'TEXT', 'IMAGE', 'STRUCTURED'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Prompts' : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <span className="text-slate-900 font-bold">{stats.total}</span> Prompts
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-900 font-bold">{stats.devFocused}</span> for Devs
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-900 font-bold">{stats.contributors}</span> Contributors
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900">No prompts found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PromptLibrary. Curated from the community.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Submit a Prompt</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;