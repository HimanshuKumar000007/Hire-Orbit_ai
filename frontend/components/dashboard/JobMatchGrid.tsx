"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Filter, ChevronDown, Search, X, AlertCircle } from 'lucide-react';
import type { JobMatch } from '@/lib/types';
import { JobCard } from './JobCard';
import { Button } from '@/components/ui/button';

interface JobMatchGridProps {
  jobs: JobMatch[];
}

export function JobMatchGrid({ jobs }: JobMatchGridProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<'all' | 'strong' | 'good' | 'weak'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'remote' | 'onsite'>('all');
  const [visibleCount, setVisibleCount] = useState(4);

  // Compute filtered jobs
  const filteredJobs = useMemo(() => {
    return (jobs || []).filter((job) => {
      // 1. Search Query Filter (Title, Company, Matched/Missing Skills)
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        (job.title || "").toLowerCase().includes(query) ||
        (job.company || "").toLowerCase().includes(query) ||
        (job.matchedSkills || []).some(s => s.toLowerCase().includes(query)) ||
        (job.missingSkills || []).some(s => s.toLowerCase().includes(query));

      // 2. Match Strength Filter
      const matchLabel = job.matchLabel || (job.matchScore >= 75 ? 'strong' : (job.matchScore >= 50 ? 'good' : 'weak'));
      const matchesStrength = matchFilter === 'all' || matchLabel === matchFilter;

      // 3. Location Type Filter
      const isRemote = (job.location || "").toLowerCase().includes("remote");
      const matchesLocation = locationFilter === 'all' || 
        (locationFilter === 'remote' && isRemote) || 
        (locationFilter === 'onsite' && !isRemote);

      return matchesQuery && matchesStrength && matchesLocation;
    });
  }, [jobs, searchQuery, matchFilter, locationFilter]);

  // Compute displayed jobs
  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  // Active filters count
  const activeFiltersCount = (matchFilter !== 'all' ? 1 : 0) + (locationFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery("");
    setMatchFilter("all");
    setLocationFilter("all");
  };

  const handleViewAllToggle = () => {
    if (visibleCount >= filteredJobs.length) {
      setVisibleCount(4); // Collapse back to default rows
    } else {
      setVisibleCount(filteredJobs.length); // Expand to show all filtered jobs
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <motion.section
      id="jobs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Job Matches</h2>
            <p className="text-sm text-zinc-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} matching your criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer ${
              showFilters || activeFiltersCount > 0 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : ''
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {filteredJobs.length > 4 && (
            <Button 
              onClick={handleViewAllToggle}
              className={`${
                visibleCount >= filteredJobs.length
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow-sm'
              } transition-all duration-300 font-bold cursor-pointer`}
            >
              {visibleCount >= filteredJobs.length ? 'Show Less' : 'View All'}
            </Button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl mb-4">
              {/* Col 1: Search */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Search Query</span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Role, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 focus:border-emerald-500 rounded-2xl py-3 pl-10 pr-10 text-sm text-white focus:outline-none transition-all placeholder-zinc-650"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Col 2: Match Level */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Match Level</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'strong', label: '🔥 Strong' },
                    { id: 'good', label: '👍 Good' },
                    { id: 'weak', label: '⚠️ Weak' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setMatchFilter(item.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        matchFilter === item.id 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold' 
                          : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Col 3: Workplace Location */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Workplace Location</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'remote', label: '🏠 Remote' },
                    { id: 'onsite', label: '🏢 Onsite/Hybrid' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setLocationFilter(item.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        locationFilter === item.id 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold' 
                          : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid or Empty State */}
      {filteredJobs.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedJobs.map((job, index) => (
              <motion.div
                layout
                key={job.id || `${job.title}-${job.company}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <JobCard job={job} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl text-center space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center text-zinc-500">
            <AlertCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Matching Jobs Found</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              We couldn&apos;t find any jobs matching your search parameters. Try clearing or adjusting the filters.
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <Button 
              onClick={handleResetFilters}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2 rounded-xl text-xs cursor-pointer"
            >
              Reset All Filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredJobs.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-2"
        >
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white px-8 py-3 rounded-xl font-bold cursor-pointer"
          >
            Load More Jobs
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
}
