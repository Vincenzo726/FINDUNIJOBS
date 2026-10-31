export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface UserAccount {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface CandidateProfile {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  university?: string;
  courseOfStudy?: string;
  qualification?: 'ND' | 'HND' | 'BSc' | 'BEng' | 'BA' | 'MSc' | 'PhD' | 'Undergraduate' | 'Other';
  graduationYear?: string;
  academicLevel?: 'Undergraduate' | 'NYSC' | 'Entry-level' | 'Junior' | 'Mid-level' | 'Senior';
  skills: string[];
  experience?: string;
  careerInterests: string[];
  preferredLocations: string[];
  employmentPreferences: string[];
  cvUrl?: string;
  updatedAt?: string;
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  companyEmail: string;
  website?: string;
  location?: string;
  description?: string;
  verified: boolean;
  updatedAt?: string;
}

export interface NormalizedJob {
  id: string;
  provider: 'jooble' | 'jobicy' | 'employer';
  providerJobId: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  location: string;
  employmentType: string;
  salary: string | null;
  currency: string | null;
  skills: string[];
  publishedAt: string | null;
  updatedAt: string | null;
  applicationUrl: string;
  sourceUrl: string;
  isRemote: boolean;
  fetchedAt: string;
  sourceAttribution: string;
  employerStatus?: 'pending' | 'approved' | 'rejected';
}

export interface JobMatchResult {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
  reason: string;
  matchingSkills: string[];
  missingSkills: string[];
  source: 'jooble' | 'jobicy' | 'employer';
  applicationUrl: string;
  job: NormalizedJob;
}

export interface AiJobDiscoveryResponse {
  success: boolean;
  searchSummary: string;
  matches: JobMatchResult[];
  providersUsed: string[];
  resultsCount: number;
  warning?: string;
}

export interface JobAlertItem {
  id: string;
  userId: string;
  keyword: string;
  location: string;
  frequency: 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
}

export type Job = NormalizedJob;

export interface JobFilters {
  keyword: string;
  category: string;
  location: string;
  dateRange: string;
  sortBy: 'newest' | 'oldest' | 'salary-high' | 'salary-low';
  level: string;
  remoteOnly: boolean;
  page: number;
  limit: number;
}
