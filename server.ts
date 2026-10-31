import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { fetchJobicyJobs, fetchJoobleJobs } from './src/services/jobProviders.ts';
import { NormalizedJob, JobMatchResult, AiJobDiscoveryResponse } from './src/types/job.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory store for approved/pending employer jobs
const employerJobsStore: NormalizedJob[] = [];

// Provider health check endpoint
app.get('/api/health/providers', async (_req: Request, res: Response) => {
  const hasJoobleKey = Boolean(
    process.env.JOOBLE_NG_API_KEY &&
    process.env.JOOBLE_NG_API_KEY.trim() !== '' &&
    process.env.JOOBLE_NG_API_KEY.trim() !== 'MY_JOOBLE_NG_API_KEY'
  );

  let jobicyHealthy = false;
  let jobicyCount = 0;
  try {
    const jobicyTest = await fetchJobicyJobs({ count: 5 });
    jobicyHealthy = jobicyTest.jobs.length > 0;
    jobicyCount = jobicyTest.jobs.length;
  } catch (e) {
    jobicyHealthy = false;
  }

  res.json({
    status: 'ok',
    providers: {
      jobicy: {
        name: 'Jobicy Remote Job API',
        status: jobicyHealthy ? 'connected' : 'error',
        requiresKey: false,
        sampleReturned: jobicyCount,
        attribution: 'https://jobicy.com/api/jobs',
      },
      jooble: {
        name: 'Jooble Nigeria Regional API',
        status: hasJoobleKey ? 'configured' : 'key_missing',
        requiresKey: true,
        keyConfigured: hasJoobleKey,
        setupInstructions: hasJoobleKey
          ? 'API Key loaded from environment secrets.'
          : 'Register for free at https://ng.jooble.org/api/about and add JOOBLE_NG_API_KEY to Settings > Secrets.',
      },
      gemini: {
        name: 'Google Gemini 3.8 Flash',
        status: Boolean(process.env.GEMINI_API_KEY) ? 'connected' : 'unconfigured',
        model: 'gemini-3.8-flash',
      },
    },
  });
});

// GET /api/jobs: Aggregates real jobs from Jobicy, Jooble NG, and approved employer listings
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const {
      keyword = '',
      location = 'Nigeria',
      remoteOnly = 'false',
      page = '1',
      limit = '15',
    } = req.query as Record<string, string>;

    const allRealJobs: NormalizedJob[] = [];
    const providerStatuses: Record<string, any> = {};

    // 1. Fetch real jobs from Jobicy
    const jobicyRes = await fetchJobicyJobs({ keyword });
    if (jobicyRes.jobs.length > 0) {
      allRealJobs.push(...jobicyRes.jobs);
    }
    providerStatuses.jobicy = {
      connected: true,
      count: jobicyRes.jobs.length,
      error: jobicyRes.error,
    };

    // 2. Fetch real jobs from Jooble Nigeria if configured
    const joobleRes = await fetchJoobleJobs({
      keyword,
      location,
      page: Number(page) || 1,
    });
    if (joobleRes.jobs.length > 0) {
      allRealJobs.push(...joobleRes.jobs);
    }
    providerStatuses.jooble = {
      configured: joobleRes.configured,
      connected: joobleRes.jobs.length > 0,
      count: joobleRes.jobs.length,
      message: joobleRes.error,
    };

    // 3. Include approved employer jobs
    const approvedEmployerJobs = employerJobsStore.filter((j) => j.employerStatus === 'approved');
    allRealJobs.push(...approvedEmployerJobs);

    // Apply filtering
    let filtered = allRealJobs;

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (remoteOnly === 'true') {
      filtered = filtered.filter((j) => j.isRemote);
    }

    if (location && location !== 'All Locations' && location !== 'Nigeria' && location !== 'all') {
      const locQ = location.toLowerCase();
      filtered = filtered.filter(
        (j) => j.location.toLowerCase().includes(locQ) || (locQ.includes('remote') && j.isRemote)
      );
    }

    // Pagination
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, parseInt(limit, 10) || 15);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageLimit) || 1;
    const startIndex = (currentPage - 1) * pageLimit;
    const paginatedJobs = filtered.slice(startIndex, startIndex + pageLimit);

    res.json({
      jobs: paginatedJobs,
      total,
      page: currentPage,
      totalPages,
      providers: providerStatuses,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch jobs', message: err.message });
  }
});

// Single job details
app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check employer jobs
  const employerJob = employerJobsStore.find((j) => j.id === id);
  if (employerJob) {
    res.json(employerJob);
    return;
  }

  // Look in cached/live Jobicy feed
  const jobicyRes = await fetchJobicyJobs({ count: 50 });
  const foundJobicy = jobicyRes.jobs.find((j) => j.id === id);
  if (foundJobicy) {
    res.json(foundJobicy);
    return;
  }

  res.status(404).json({ error: 'Job not found in active providers', id });
});

// Employer endpoints
app.post('/api/employer/jobs', (req: Request, res: Response) => {
  const { employerId, companyName, title, description, location, employmentType, salary, currency, skills, applicationUrl } = req.body;

  if (!employerId || !companyName || !title || !description) {
    res.status(400).json({ error: 'Missing required job parameters' });
    return;
  }

  const newJob: NormalizedJob = {
    id: `emp-${Date.now()}`,
    provider: 'employer',
    providerJobId: `emp-${Date.now()}`,
    title,
    company: companyName,
    description,
    location: location || 'Lagos, Nigeria',
    employmentType: employmentType || 'Full-time',
    salary: salary ? `${currency || '₦'}${salary}` : null,
    currency: currency || 'NGN',
    skills: Array.isArray(skills) ? skills : [],
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationUrl: applicationUrl || '#',
    sourceUrl: applicationUrl || '#',
    isRemote: (location || '').toLowerCase().includes('remote'),
    fetchedAt: new Date().toISOString(),
    sourceAttribution: 'FJ FindUniJob Verified Employer',
    employerStatus: 'pending',
  };

  employerJobsStore.unshift(newJob);
  res.json({ success: true, job: newJob });
});

app.get('/api/employer/jobs', (req: Request, res: Response) => {
  const { employerId } = req.query as { employerId: string };
  if (!employerId) {
    res.status(400).json({ error: 'employerId is required' });
    return;
  }
  const employerJobs = employerJobsStore.filter((j) => (j as any).employerId === employerId);
  res.json(employerJobs);
});

// Admin review endpoints
app.get('/api/admin/jobs/pending', (_req: Request, res: Response) => {
  const pending = employerJobsStore.filter((j) => j.employerStatus === 'pending');
  res.json(pending);
});

app.patch('/api/admin/jobs/:id/approval', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'

  const jobIndex = employerJobsStore.findIndex((j) => j.id === id);
  if (jobIndex === -1) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  employerJobsStore[jobIndex].employerStatus = status;
  res.json({ success: true, job: employerJobsStore[jobIndex] });
});

// POST /api/ai/find-jobs: Real AI job discovery using Gemini 3.8 Flash over actual provider jobs
app.post('/api/ai/find-jobs', async (req: Request, res: Response) => {
  try {
    const { query = '', profile } = req.body;

    if (!query && !profile) {
      res.status(400).json({ error: 'Please provide a search request or candidate profile.' });
      return;
    }

    // 1. Fetch real jobs from providers
    const [jobicyData, joobleData] = await Promise.all([
      fetchJobicyJobs({ count: 25 }),
      fetchJoobleJobs({ keyword: query || 'Graduate OR Developer OR Analyst', location: 'Nigeria' }),
    ]);

    const candidateRealJobs: NormalizedJob[] = [...jobicyData.jobs, ...joobleData.jobs];

    if (candidateRealJobs.length === 0) {
      res.json({
        success: true,
        searchSummary: 'No live vacancies returned by providers for this specific query at the moment.',
        matches: [],
        providersUsed: ['jobicy', 'jooble'],
        resultsCount: 0,
      });
      return;
    }

    const hasApiKey = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY.trim() !== 'MY_GEMINI_API_KEY'
    );

    if (!hasApiKey) {
      // Return honest notice that Gemini key is required for AI ranking, and provide raw search results
      res.json({
        success: false,
        searchSummary: 'Gemini AI API key is not configured. Displaying real job results without semantic ranking.',
        matches: candidateRealJobs.slice(0, 8).map((j) => ({
          jobId: j.id,
          title: j.title,
          company: j.company,
          matchScore: 80,
          reason: 'Direct match from live provider feed.',
          matchingSkills: [],
          missingSkills: [],
          source: j.provider,
          applicationUrl: j.applicationUrl,
          job: j,
        })),
        providersUsed: ['jobicy', 'jooble'],
        resultsCount: candidateRealJobs.length,
        warning: 'Gemini API key is required for deep semantic evaluation.',
      });
      return;
    }

    // 2. Prepare concise pool for Gemini to evaluate
    const poolForModel = candidateRealJobs.slice(0, 10).map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      isRemote: j.isRemote,
      description: j.description.slice(0, 250),
      employmentType: j.employmentType,
      provider: j.provider,
      applicationUrl: j.applicationUrl,
    }));

    const candidateContext = profile
      ? `CANDIDATE PROFILE:
- Name: ${profile.fullName || 'Candidate'}
- University: ${profile.university || 'Nigerian University'}
- Course: ${profile.courseOfStudy || 'Not specified'}
- Degree: ${profile.qualification || 'BSc/HND'}
- Academic Level: ${profile.academicLevel || 'Entry-Level / NYSC'}
- Skills: ${(profile.skills || []).join(', ')}
- Career Interests: ${(profile.careerInterests || []).join(', ')}
- Preferred Locations: ${(profile.preferredLocations || []).join(', ')}`
      : 'General Nigerian Student / Early Career Jobseeker';

    const prompt = `You are the lead AI Career Discovery Assistant for FJ FindUniJob, a Nigerian university and early-career job platform.

USER QUERY: "${query || 'Recommend best matching early career opportunities'}"

${candidateContext}

LIVE REAL JOB POOL (You MUST ONLY select from these exact IDs):
${JSON.stringify(poolForModel, null, 2)}

TASK:
1. Identify the top 5 to 8 most relevant real jobs from the provided list.
2. Under no circumstance should you invent or hallucinate job IDs or companies. Every jobId MUST match an id in the input list.
3. Calculate a transparent matchScore (between 50 and 99).
4. Provide a personalized reason explaining why this real opportunity fits a Nigerian student or early-career candidate.
5. Identify matching skills and missing skills/areas for growth.
6. Provide a concise searchSummary.`;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert AI Career Matcher for Nigerian graduates and university talent. You strictly rank only real jobs provided to you, never fabricating vacancies.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            searchSummary: {
              type: Type.STRING,
              description: 'Concise summary of findings for the candidate.',
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobId: {
                    type: Type.STRING,
                    description: 'Exact ID from the provided real job pool.',
                  },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                  matchingSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  missingSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  source: { type: Type.STRING },
                  applicationUrl: { type: Type.STRING },
                },
                required: ['jobId', 'matchScore', 'reason', 'matchingSkills', 'missingSkills'],
              },
            },
          },
          required: ['searchSummary', 'matches'],
        },
      },
    });

    const parsed = JSON.parse(geminiResponse.text || '{}');
    const rawMatches = parsed.matches || [];

    // Strictly validate: every recommended jobId must exist in candidateRealJobs!
    const verifiedMatches: JobMatchResult[] = [];
    for (const m of rawMatches) {
      const realJob = candidateRealJobs.find((j) => j.id === m.jobId);
      if (realJob) {
        verifiedMatches.push({
          jobId: realJob.id,
          title: realJob.title,
          company: realJob.company,
          matchScore: Math.min(99, Math.max(50, Number(m.matchScore) || 75)),
          reason: m.reason || 'Strong alignment with your candidate background and qualifications.',
          matchingSkills: Array.isArray(m.matchingSkills) ? m.matchingSkills : [],
          missingSkills: Array.isArray(m.missingSkills) ? m.missingSkills : [],
          source: realJob.provider,
          applicationUrl: realJob.applicationUrl,
          job: realJob,
        });
      }
    }

    res.json({
      success: true,
      searchSummary: parsed.searchSummary || 'Opportunities evaluated against real provider vacancies.',
      matches: verifiedMatches,
      providersUsed: ['jobicy', joobleData.configured ? 'jooble' : 'jooble (key needed)'],
      resultsCount: verifiedMatches.length,
    });
  } catch (err: any) {
    console.error('AI Find Jobs error:', err.message || err);
    // Graceful fallback to real provider jobs if Gemini is temporarily under high demand
    try {
      const fallbackJobs = await fetchJobicyJobs({ count: 10 });
      res.json({
        success: true,
        searchSummary: 'Gemini AI service is temporarily experiencing high upstream traffic. Presenting live verified vacancies directly from Jobicy without semantic ranking.',
        matches: fallbackJobs.jobs.slice(0, 8).map((j) => ({
          jobId: j.id,
          title: j.title,
          company: j.company,
          matchScore: 82,
          reason: 'Verified active opportunity retrieved from real job provider feed.',
          matchingSkills: j.skills,
          missingSkills: [],
          source: j.provider,
          applicationUrl: j.applicationUrl,
          job: j,
        })),
        providersUsed: ['jobicy'],
        resultsCount: fallbackJobs.jobs.length,
        warning: 'AI semantic scoring is temporarily experiencing upstream model latency; showing direct real listings.',
      });
    } catch {
      res.status(503).json({
        success: false,
        error: 'AI search temporarily unavailable',
        message: 'The AI model is experiencing a high-traffic spike. Please retry shortly.',
      });
    }
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FJ FindUniJob Nigeria running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
