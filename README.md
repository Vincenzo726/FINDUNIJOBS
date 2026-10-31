# FJ FindUniJob — Production-Ready Nigerian AI Job Discovery Platform

A full-stack, production-minded employment platform designed specifically for Nigerian university students, graduates, NYSC corp members, and early-career professionals. 

Powered by **Google Gemini 3.8 Flash**, **Firebase Authentication**, **Cloud Firestore**, and **Real Live Job APIs** (Jobicy & Jooble Nigeria).

---

## 1. Product Identity & Target Market

- **Product Name**: FJ FindUniJob
- **Primary Audience**:
  - Nigerian university undergraduates and final-year students (UNILAG, UI, OAU, FUTA, ABU, Covenant, etc.)
  - National Youth Service Corps (NYSC) members seeking Primary Place of Assignment (PPA) or post-NYSC roles
  - Fresh graduates (ND, HND, BSc, BEng, BA, MSc)
  - Junior developers and technology professionals seeking local and legitimate remote positions
- **Localization**:
  - Country: Nigeria (Default Country Code: `+234`)
  - Currency: Nigerian Naira (`₦`) for local salaries; native currency (`$`, `£`, `€`) for verified remote roles
  - Hubs: Lagos, Abuja, Ibadan, Port Harcourt, Benin City, Enugu, Abeokuta, and Remote Worldwide
  - Timezone: `Africa/Lagos`

---

## 2. Real Architecture (No Synthetic Data or Mock Accounts)

```
├── firebase-applet-config.json    # Provisioned Firebase Project credentials
├── firebase-blueprint.json        # Firestore IR Blueprint definition
├── firestore.rules                # Hardened security rules with RBAC (deployed)
├── server.ts                      # Express API server (aggregators, AI endpoint, employer portal)
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx     # Provider health inspection & employer vacancy moderation
│   │   ├── AiMatcherPage.tsx      # Real AI job discovery with Gemini 3.8 Flash
│   │   ├── AuthModal.tsx          # Real Firebase Auth (Email/Pass, Google Sign-In)
│   │   ├── CareerAdvisorPage.tsx  # Gemini early-career mentor
│   │   ├── DashboardPage.tsx      # Persistent candidate profile & Firestore job alerts
│   │   ├── EmployerDashboard.tsx  # Direct employer job posting & tracking portal
│   │   ├── HeroSection.tsx        # Faithful brand headline with accented styling
│   │   ├── JobCard.tsx            # Live job card with source attribution & direct apply URL
│   │   ├── JobDetailsModal.tsx    # Full vacancy specifications & genuine application redirect
│   │   ├── Navbar.tsx             # Responsive nav with role indicator & session status
│   │   ├── SavedJobsDrawer.tsx    # Live saved jobs manager
│   │   └── SearchAndFilters.tsx   # Nigerian city filters & NYSC/undergraduate level pills
│   ├── context/
│   │   └── AuthContext.tsx        # Firebase Authentication & Firestore profile sync
│   ├── lib/
│   │   └── firebase.ts            # Client Firebase SDK initialization & connection testing
│   ├── services/
│   │   └── jobProviders.ts        # Real API adapters for Jobicy & Jooble Nigeria
│   └── types/
│       └── job.ts                 # NormalizedJob, CandidateProfile, and UserAccount models
```

---

## 3. Real Job Provider Integrations

### Provider A: Jobicy Remote Job API
- **Endpoint**: `https://jobicy.com/api/jobs?count=50&geo=anywhere`
- **Authentication**: Public API (No API key required)
- **Status**: **Connected & Live**
- **Filtering**: Specifically normalizes remote vacancies eligible for candidates in Nigeria and Africa (Anywhere, Global, Worldwide, EMEA). Preserves original Jobicy ID, description, salary, company logo, and application URL.

### Provider B: Jooble Nigeria Regional API
- **Registration**: [https://ng.jooble.org/api/about](https://ng.jooble.org/api/about)
- **Endpoint**: `POST https://ng.jooble.org/api/{JOOBLE_NG_API_KEY}`
- **Secret Name**: `JOOBLE_NG_API_KEY`
- **Status**: Fully wired in backend service (`src/services/jobProviders.ts`). When the secret is configured via AI Studio Secrets, real local vacancies from Lagos, Abuja, and Nigerian states are automatically queried and aggregated.

### Provider C: Verified Nigerian Employers
- Nigerian companies can register, submit vacancies, and specify salaries in Naira (`₦`).
- Submissions enter an administrator moderation queue (`/api/admin/jobs/pending`) before being published.

---

## 4. Real AI Job Discovery (Gemini 3.8 Flash)

- **Endpoint**: `POST /api/ai/find-jobs`
- **Workflow**:
  1. Receives natural-language candidate query (e.g. *"Find entry-level developer jobs in Lagos or remote that accept Nigerian graduates"*).
  2. Queries real job provider feeds to retrieve live active listings.
  3. Sends retrieved real listings and authenticated candidate qualifications to Gemini 3.8 Flash (`ai.models.generateContent` with structured JSON schema).
  4. Strictly validates that every recommended `jobId` exists in the real provider feed.
  5. Explains semantic fit, matching skills, and growth gaps with original application links.

---

## 5. Security & Role-Based Access Control (RBAC)

- **Roles**:
  - `job_seeker`: Browse real jobs, use AI matcher, manage profile, save opportunities, set job alerts.
  - `employer`: Post job vacancies, track approval status, manage employer profile.
  - `admin`: Moderate employer submissions, monitor live provider health.
- **Rules Deployed**: Hardened `firestore.rules` deployed via Firebase RPC preventing unauthorized role escalation, data tampering, and orphaned writes.

---

## 6. How to Configure External Keys

To add your free Jooble Nigeria API key:
1. Register at [https://ng.jooble.org/api/about](https://ng.jooble.org/api/about) to receive your free key.
2. Open **Settings > Secrets** in Google AI Studio.
3. Add a secret with name: `JOOBLE_NG_API_KEY` and your key as value.
