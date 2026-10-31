import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  count: number;
}

interface RoleTaxonomyProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const RoleTaxonomy: React.FC<RoleTaxonomyProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          UNIJOB ROLE TAXONOMY
        </span>

        {/* Scroll helper buttons for clean desktop navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Pill Row matching screenshot */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
            (selectedCategory === 'All Categories' && cat.name === 'All Categories');

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected
                    ? 'bg-indigo-700/80 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
