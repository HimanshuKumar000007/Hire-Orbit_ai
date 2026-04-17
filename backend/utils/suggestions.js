/**
 * Calculate impact of adding each missing skill
 * @param {Array} userSkills - Current user skills
 * @param {Array} jobs - Matched jobs with missingSkills
 * @returns {Array} Sorted suggestions with impact scores
 */
export const getSmartSuggestions = (userSkills, jobs) => {
  const skillImpactMap = new Map();

  // Analyze all jobs to find high-impact skills
  jobs.forEach((job) => {
    // Standardize skill source (handle both 'skills' array or 'job_description' fallback)
    const skillsToAnalyze = job.skills || [];
    const totalSkills = skillsToAnalyze.length || 1;
    
    (job.missingSkills || []).forEach((skill) => {
      // Calculate how much this skill would boost the match
      const impactPerSkill = Math.round(100 / totalSkills);
      
      if (!skillImpactMap.has(skill)) {
        skillImpactMap.set(skill, {
          skill: skill,
          totalImpact: 0,
          jobCount: 0,
          avgBoost: 0
        });
      }

      const current = skillImpactMap.get(skill);
      current.totalImpact += impactPerSkill;
      current.jobCount += 1;
      current.avgBoost = Math.round(current.totalImpact / current.jobCount);
    });
  });

  // Convert to array and sort by impact
  return Array.from(skillImpactMap.values())
    .sort((a, b) => b.avgBoost - a.avgBoost)
    .slice(0, 5) // Top 5 suggestions
    .map(item => ({
      skill: item.skill,
      impact: `+${item.avgBoost}%`,
      jobCount: item.jobCount,
      priority: item.avgBoost >= 20 ? "HIGH" : item.avgBoost >= 10 ? "MEDIUM" : "LOW"
    }));
};
