// backend/utils/matchJobs.js

/**
 * Enhanced match function with skill suggestions and dynamic extraction
 */
export function matchJobs(userSkills = [], jobs = []) {
  const userSkillsLower = userSkills.map(s => s.toLowerCase().trim());
  
  return jobs
    .map((job) => {
      // Handle different job structures (JSearch vs Adzuna vs local)
      const rawSkills = job.skills || extractSkillsFromDescription(job.description || job.job_description || "");
      const jobSkillsLower = rawSkills.map(s => s.toLowerCase().trim());
      
      const matchedSkillsLower = jobSkillsLower.filter(skill =>
        userSkillsLower.some(us => us.includes(skill) || skill.includes(us))
      );

      // Keep original casing for matched skills (for display)
      const matchedSkills = rawSkills.filter(s =>
        matchedSkillsLower.includes(s.toLowerCase().trim())
      );

      const missingSkills = rawSkills.filter(s =>
        !matchedSkillsLower.includes(s.toLowerCase().trim())
      );

      const matchPercent = jobSkillsLower.length > 0 
        ? Math.max(Math.round((matchedSkills.length / jobSkillsLower.length) * 100), 30)
        : 30;

      // Calculate individual skill impact
      const skillImpact = Math.round(100 / (jobSkillsLower.length || 1));

      const topSuggestions = missingSkills
        .slice(0, 3)
        .map(skill => ({
          skill: skill,
          impact: `+${skillImpact}%`,
          newMatch: Math.min(matchPercent + skillImpact, 100)
        }));

      return {
        ...job,
        match: matchPercent,
        matchScore: matchPercent,
        matchedSkills,
        missingSkills,
        suggestions: topSuggestions,
        skills: rawSkills,
        // Ensure display fields are always present
        salary: job.salary || "Competitive",
        location: job.location || "India",
        postedAt: job.postedAt || "New",
        redirect_url: job.redirect_url || job.job_apply_link || "#",
        job_apply_link: job.redirect_url || job.job_apply_link || "#",
      };
    })
    .sort((a, b) => b.match - a.match);
}


// Helper to extract skills from job description when not provided
function extractSkillsFromDescription(description) {
  if (!description) return [];
  
  const commonSkills = [
    'react', 'javascript', 'node.js', 'python', 'java', 'teaching',
    'classroom management', 'lesson planning', 'sql', 'aws', 'docker',
    'mathematics', 'science', 'english', 'communication'
  ];
  
  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
}
