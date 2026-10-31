import { NormalizedJob } from '../types/job.ts';

// In-memory cache to prevent hitting external APIs too frequently
interface CacheEntry {
  timestamp: number;
  data: NormalizedJob[];
}

const jobCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes

// Strip HTML tags safely
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Fetch real remote opportunities from Jobicy API
 * Official Endpoint: https://jobicy.com/api/jobs
 * Public API, no key required.
 */
export async function fetchJobicyJobs(params: {
  keyword?: string;
  geo?: string;
  industry?: string;
  count?: number;
}): Promise<{ jobs: NormalizedJob[]; error?: string }> {
  const cacheKey = `jobicy_${params.keyword || ''}_${params.industry || ''}`;
  const cached = jobCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { jobs: cached.data };
  }

  try {
    const url = new URL('https://jobicy.com/api/jobs');
    url.searchParams.set('count', String(params.count || 50));
    url.searchParams.set('geo', 'anywhere');
    if (params.industry) url.searchParams.set('industry', params.industry);
    // Jobicy 'tag' parameter only accepts single word slugs (e.g. dev, react, python)
    if (params.keyword && !params.keyword.includes(' ') && params.keyword.length < 15) {
      url.searchParams.set('tag', params.keyword.toLowerCase().trim());
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FJ-FindUniJob-Platform/1.0',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { jobs: [], error: `Jobicy returned HTTP ${response.status}` };
    }

    const json = await response.json();
    const rawJobs = Array.isArray(json.jobs) ? json.jobs : [];

    const normalized: NormalizedJob[] = rawJobs
      .filter((item: any) => {
        // Ensure remote eligibility for African/Nigerian candidates when specified
        const geo = (item.jobGeo || '').toLowerCase();
        const isEligible =
          geo.includes('anywhere') ||
          geo.includes('worldwide') ||
          geo.includes('global') ||
          geo.includes('emea') ||
          geo.includes('africa') ||
          geo.includes('nigeria') ||
          geo === '';
        return isEligible;
      })
      .map((item: any) => {
        const salaryText =
          item.annualSalaryMin && item.annualSalaryMax
            ? `${item.salaryCurrency || '$'}${Number(item.annualSalaryMin).toLocaleString()} - ${item.salaryCurrency || '$'}${Number(item.annualSalaryMax).toLocaleString()} / yr`
            : null;

        const skills: string[] = [];
        if (Array.isArray(item.jobIndustry)) skills.push(...item.jobIndustry);
        else if (typeof item.jobIndustry === 'string') skills.push(item.jobIndustry);

        return {
          id: `jobicy-${item.id}`,
          provider: 'jobicy' as const,
          providerJobId: String(item.id),
          title: item.jobTitle || 'Remote Opportunity',
          company: item.companyName || 'Global Employer',
          companyLogo: item.companyLogo || undefined,
          description: stripHtml(item.jobDescription || item.jobExcerpt || ''),
          location: item.jobGeo ? `Remote (${item.jobGeo})` : 'Remote (Worldwide)',
          employmentType: Array.isArray(item.jobType) ? item.jobType.join(', ') : item.jobType || 'Full-time',
          salary: salaryText,
          currency: item.salaryCurrency || null,
          skills: skills.slice(0, 6),
          publishedAt: item.pubDate || new Date().toISOString(),
          updatedAt: item.pubDate || null,
          applicationUrl: item.url,
          sourceUrl: item.url,
          isRemote: true,
          fetchedAt: new Date().toISOString(),
          sourceAttribution: 'Jobicy Remote Job Feed',
        };
      });

    jobCache.set(cacheKey, { timestamp: Date.now(), data: normalized });
    return { jobs: normalized };
  } catch (err: any) {
    console.error('Jobicy API error:', err.message);
    return { jobs: [], error: err.message };
  }
}

/**
 * Fetch real Nigerian vacancies from Jooble Nigeria API
 * Official Endpoint: POST https://ng.jooble.org/api/{api_key}
 */
export async function fetchJoobleJobs(params: {
  keyword?: string;
  location?: string;
  page?: number;
}): Promise<{ jobs: NormalizedJob[]; configured: boolean; error?: string }> {
  const apiKey = process.env.JOOBLE_NG_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'MY_JOOBLE_NG_API_KEY') {
    return {
      jobs: [],
      configured: false,
      error: 'JOOBLE_NG_API_KEY is not configured in environment secrets. Register free at https://ng.jooble.org/api/about',
    };
  }

  const cacheKey = `jooble_${params.keyword || ''}_${params.location || 'Nigeria'}_${params.page || 1}`;
  const cached = jobCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { jobs: cached.data, configured: true };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const body = {
      keywords: params.keyword || 'Graduate OR Junior OR Developer OR Analyst',
      location: params.location || 'Nigeria',
      page: String(params.page || 1),
      ResultOnPage: '20',
    };

    const response = await fetch(`https://ng.jooble.org/api/${apiKey.trim()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        jobs: [],
        configured: true,
        error: `Jooble Nigeria returned HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];

    const normalized: NormalizedJob[] = rawJobs.map((item: any) => {
      let formattedSalary: string | null = null;
      if (item.salary && item.salary.trim()) {
        const cleanSalary = item.salary.trim();
        formattedSalary = cleanSalary.includes('₦') ? cleanSalary : `₦${cleanSalary}`;
      }

      return {
        id: `jooble-${item.id}`,
        provider: 'jooble' as const,
        providerJobId: String(item.id),
        title: item.title || 'Nigerian Opportunity',
        company: item.company || 'Verified Employer',
        description: stripHtml(item.snippet || ''),
        location: item.location || 'Nigeria',
        employmentType: item.type || 'Full-time',
        salary: formattedSalary,
        currency: formattedSalary ? 'NGN' : null,
        skills: [],
        publishedAt: item.updated || new Date().toISOString(),
        updatedAt: item.updated || null,
        applicationUrl: item.link,
        sourceUrl: item.link,
        isRemote: (item.location || '').toLowerCase().includes('remote'),
        fetchedAt: new Date().toISOString(),
        sourceAttribution: 'Jooble Nigeria Feed (ng.jooble.org)',
      };
    });

    jobCache.set(cacheKey, { timestamp: Date.now(), data: normalized });
    return { jobs: normalized, configured: true };
  } catch (err: any) {
    console.error('Jooble Nigeria API error:', err.message);
    return { jobs: [], configured: true, error: err.message };
  }
}
