"use client";

import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  GraduationCap, 
  Building2,
  SlidersHorizontal 
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  selectedSector: string;
  selectedQualification: string;
  selectedState: string;
  sortBy: 'latest' | 'deadline' | 'updated';
}

interface JobSearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

export const SECTORS = [
  { id: 'all', label: 'All Sectors' },
  { id: 'central', label: 'Central / SSC / UPSC' },
  { id: 'railway', label: 'Railways (RRB)' },
  { id: 'banking', label: 'Banking (IBPS/SBI)' },
  { id: 'police', label: 'Police & Defense' },
  { id: 'teaching', label: 'Teaching (TET/KVS)' },
  { id: 'state', label: 'State PSC / Boards' },
  { id: 'healthcare', label: 'Healthcare / Nursing' },
  { id: 'engineering', label: 'Engineering' },
];

export const QUALIFICATIONS = [
  { id: 'all', label: 'All Qualifications' },
  { id: '10th', label: '10th Pass' },
  { id: '12th', label: '12th Pass (Inter)' },
  { id: 'iti', label: 'ITI Trade' },
  { id: 'diploma', label: 'Diploma' },
  { id: 'graduate', label: 'Graduate (BA/BSc/BCom/BTech)' },
  { id: 'postgraduate', label: 'Postgraduate (MA/MSc/MTech)' },
];

export const STATES = [
  { id: 'all', label: 'All Locations' },
  { id: 'all-india', label: 'All India / Central' },
  { id: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { id: 'bihar', label: 'Bihar' },
  { id: 'rajasthan', label: 'Rajasthan' },
  { id: 'delhi', label: 'Delhi / NCR' },
  { id: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { id: 'maharashtra', label: 'Maharashtra' },
  { id: 'west-bengal', label: 'West Bengal' },
  { id: 'haryana', label: 'Haryana' },
  { id: 'punjab', label: 'Punjab' },
  { id: 'odisha', label: 'Odisha' },
  { id: 'gujarat', label: 'Gujarat' },
  { id: 'tamil-nadu', label: 'Tamil Nadu' },
];

export function JobSearchAndFilters({ filters, onFilterChange, totalResults }: JobSearchAndFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      selectedSector: 'all',
      selectedQualification: 'all',
      selectedState: 'all',
      sortBy: 'latest',
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.selectedSector !== 'all' || 
    filters.selectedQualification !== 'all' || 
    filters.selectedState !== 'all' ||
    filters.sortBy !== 'latest';

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by job title, exam name, department, or qualification..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-zinc-500 text-xs flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="latest">Latest Published First</option>
            <option value="deadline">Last Date Soon (Urgent)</option>
            <option value="updated">Most Recently Updated</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Sector Pill Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" /> Sector:
        </span>
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => updateFilter('selectedSector', sector.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filters.selectedSector === sector.id
                ? 'bg-emerald-500 text-zinc-950 shadow-glow-sm'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {sector.label}
          </button>
        ))}
      </div>

      {/* Secondary Dropdown Filters: Qualification & State */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Qualification Filter */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={filters.selectedQualification}
              onChange={(e) => updateFilter('selectedQualification', e.target.value)}
              className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q.id} value={q.id}>{q.label}</option>
              ))}
            </select>
          </div>

          {/* State / Location Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={filters.selectedState}
              onChange={(e) => updateFilter('selectedState', e.target.value)}
              className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
            >
              {STATES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-zinc-500 text-xs font-medium">
          Showing <span className="text-emerald-400 font-bold">{totalResults}</span> verified recruitments
        </div>
      </div>
    </div>
  );
}
