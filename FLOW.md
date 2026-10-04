# DEC CONSULTANT — USER FLOW & JOURNEYS

Last Updated: October 2026
Project: DEC Consultant Recruitment Management Portal

---

## 🎯 OVERVIEW

This document maps every user journey in the DEC Consultant portal.

**Two user types:**
- 👤 **Candidate** — Job seeker (public + logged in)
- 👨‍💼 **Admin** — HR staff (requires login)

---

## 🗺️ COMPLETE FLOW (High Level)

┌─────────────────────────────────────────────┐
│  USER VISITS DEC CONSULTANT                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Browse jobs (no login needed)             │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Click job → see details                    │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Click "Apply Now"                          │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   Logged IN    Not logged in
      │             │
      ▼             ▼
   Go to        Alert →
   Apply Form   /login
                  │
                  ▼
              User logs in → back to apply

---

## 👤 CANDIDATE FLOW 1 — Browse & Apply (Direct Application)

┌─────────────────────────────────────────────┐
│  STEP 1: Visit Home Page                    │
│  URL: /                                     │
│  Actions: See hero, categories, CTA         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Click "Browse Jobs" or Category    │
│  URL: /jobs or /jobs?category=Engineering   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 3: View Job Listings                  │
│  URL: /jobs                                 │
│  Actions: Filter by category, browse        │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 4: Click "View →" on a job            │
│  URL: /jobs/:id                             │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 5: View Job Details                   │
│  URL: /jobs/:id                             │
│  Actions: Read description, requirements    │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 6: Click "Apply Now"                  │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   Logged IN    Not logged in
      │             │
      ▼             ▼
┌───────────┐  ┌──────────────┐
│ Go to     │  │ Alert:       │
│ /apply/:id│  │ "Please log  │
│           │  │  in to apply"│
└─────┬─────┘  └──────┬───────┘
      │               │
      │               ▼
      │        ┌──────────────┐
      │        │ Redirect to  │
      │        │ /login       │
      │        └──────┬───────┘
      │               │
      │               ▼
      │        ┌──────────────┐
      │        │ User enters  │
      │        │ credentials  │
      │        └──────┬───────┘
      │               │
      │               ▼
      │        ┌──────────────┐
      │        │ Login success│
      │        │ → /jobs      │
      │        └──────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│  STEP 7: Fill Application Form              │
│  URL: /apply/:id                            │
│                                             │
│  Section 1: Basic Information               │
│  • Full Name, Email, Mobile, Gender, DOB    │
│  • Current City, Preferred Location         │
│                                             │
│  Section 2: Education & Experience          │
│  • Qualification, Specialization            │
│  • Fresher Toggle                           │
│  • IF FRESHER: Last Degree Organization     │
│  • IF EXPERIENCED:                          │
│    - Experience, Previous Org               │
│    - Current CTC, Notice Period             │
│  • Key Skills                               │
│                                             │
│  Section 3: Online Presence                 │
│  • LinkedIn URL, Portfolio URL              │
│                                             │
│  Section 4: Resume                          │
│  • PDF Upload (max 5 MB)                    │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 8: Submit Application                 │
│  Actions:                                   │
│  1. Upload resume → Supabase Storage        │
│  2. Get public URL                          │
│  3. Save application to database            │
│  4. Redirect to confirmation                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 9: Confirmation Page                  │
│  URL: /thank-you                            │
│  Message: "Application Submitted!"          │
│  Actions: Return home or browse more        │
└─────────────────────────────────────────────┘

---

## 👤 CANDIDATE FLOW 2 — Talent Pool (No Matching Job)

┌─────────────────────────────────────────────┐
│  STEP 1: Visit Home or Job Listings         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Browse jobs, no match found        │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 3: See "Didn't find..." CTA           │
│  Click "Submit Resume Anyway"               │
│  URL: /talent-pool                          │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 4: Fill Talent Pool Form              │
│  Similar to Apply Form, but:                │
│  • No specific job required                 │
│  • Add preferred category                   │
│  • Add preferred role                       │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 5: Submit to Talent Pool              │
│  Actions:                                   │
│  1. Upload resume                           │
│  2. Save to talent_pool table               │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 6: Confirmation                       │
│  Message: "You're in our Talent Pool!"      │
└─────────────────────────────────────────────┘

---

## 🔐 AUTHENTICATION FLOW

### Signup (New User)

┌─────────────────────────────────────────────┐
│  Visit /signup                              │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Fill form (name, email, password)          │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Click Sign Up                              │
│  → supabase.auth.signUp()                   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Create user in auth.users                  │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Insert into profiles table                 │
│  Role: "candidate"                          │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Redirect to /login                         │
└─────────────────────────────────────────────┘

### Login (Existing User)

┌─────────────────────────────────────────────┐
│  Visit /login                               │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Enter email + password                     │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  supabase.auth.signInWithPassword()         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Fetch role from profiles table             │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   candidate      admin
      │             │
      ▼             ▼
   /jobs        /admin

### Logout

┌─────────────────────────────────────────────┐
│  Click "Logout" in navbar                   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  supabase.auth.signOut()                    │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Redirect to /                              │
└─────────────────────────────────────────────┘

---

## 👨‍💼 ADMIN FLOW — Manage Recruitment

┌─────────────────────────────────────────────┐
│  STEP 1: Login as admin                     │
│  URL: /login                                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Redirected to Admin Dashboard      │
│  URL: /admin                                │
│  Shows: Stats, recent applications          │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  STEP 3: Admin Dashboard Actions            │
│  Options:                                   │
│  • Create New Job                           │
│  • View Applications                        │
│  • View Talent Pool                         │
└────────────┬────────────────────────────────┘
             │
      ┌──────┼──────┐
      │      │      │
      ▼      ▼      ▼
  ┌─────┐┌─────┐┌─────────┐
  │Job  ││Apps ││Talent   │
  │Mgmt ││View ││Pool     │
  └──┬──┘└──┬──┘└────┬────┘
     │      │       │
     ▼      ▼       ▼
  Create  Review  Browse
  Edit    Shortlist resumes
  Delete  Reject
  Publish Notify

---

## 🗺️ SITEMAP (All Routes)

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home | ❌ Public |
| `/jobs` | Job Listings | ❌ Public |
| `/jobs/:id` | Job Detail | ❌ Public |
| `/apply/:id` | Apply Form | ✅ Candidate |
| `/talent-pool` | Talent Pool Form | ❌ Public |
| `/thank-you` | Confirmation | ❌ Public |
| `/login` | Login | ❌ Public |
| `/signup` | Signup | ❌ Public |
| `/admin` | Admin Dashboard | ✅ Admin |
| `/admin/create-job` | Create Job | ✅ Admin |
| `/admin/applications` | View Applications | ✅ Admin |
| `/admin/talent-pool` | Talent Pool View | ✅ Admin |

---

## 📊 STATE TRANSITIONS

### Application Status Flow

┌──────────┐
│ pending  │  ← When candidate submits
└────┬─────┘
     │
     ▼ (Admin reviews)
┌──────────┐
│shortlisted│
└────┬─────┘
     │
     ▼ (Admin decides)
┌──────────┐  ┌──────────┐
│  hired   │  │ rejected │
└──────────┘  └──────────┘

### Talent Pool Status Flow

┌──────────┐
│   new    │  ← When candidate submits
└────┬─────┘
     │
     ▼ (Admin contacts)
┌──────────┐
│ contacted│
└────┬─────┘
     │
     ▼ (Decision)
┌──────────┐  ┌──────────┐
│  hired   │  │ archived │
└──────────┘  └──────────┘

---

## 🎯 KEY DECISION POINTS

### Decision 1: Login Required for Apply?

┌─────────────────────────────┐
│  User clicks "Apply Now"    │
└────────────┬────────────────┘
             │
      Is user logged in?
             │
      ┌──────┴──────┐
      │             │
     YES           NO
      │             │
      ▼             ▼
  Show form    Redirect to
               /login
               ↓
               After login → back to /jobs

**Rule:** Login required for job applications.

### Decision 2: Where to Redirect After Login?

User role determines destination:
- **candidate** → `/jobs`
- **admin** → `/admin`

### Decision 3: Talent Pool — Login Required?

**Answer:** NO! Anyone can submit to Talent Pool.

**Why:** Removes friction. Candidate may not want to sign up just to leave a resume.

### Decision 4: Fresher vs Experienced?

┌─────────────────────────────┐
│  User fills apply form      │
└────────────┬────────────────┘
             │
      Is "I am a Fresher" checked?
             │
      ┌──────┴──────┐
      │             │
     YES           NO
      │             │
      ▼             ▼
 Show:          Show:
 • Last Degree  • Experience
   Organization • Previous Org
                • Current CTC
                • Notice Period

**Rule:** Form adapts to user type.

---

## 🎯 FORM SECTIONS OVERVIEW

### Application Form (`/apply/:id`)

| Section | Fields |
|---|---|
| 👤 Basic | Name, Email, Mobile, Gender, DOB, Current City, Preferred Location |
| 🎓 Education & Experience | Qualification, Specialization, Fresher Toggle, Experience, Previous Org, CTC, Notice Period, Skills |
| 🔗 Online Presence | LinkedIn URL, Portfolio URL |
| 📎 Resume | PDF Upload (max 5 MB) |

### Talent Pool Form (`/talent-pool`)

| Section | Fields |
|---|---|
| 👤 Basic | Same as Apply Form |
| 🎯 Preferences | Preferred Category, Preferred Role, Preferred Location |
| 🎓 Education & Experience | Same as Apply Form |
| 🔗 Online Presence | LinkedIn URL, Portfolio URL |
| 📎 Resume | PDF Upload |

---

## 🚀 FUTURE ENHANCEMENTS

Planned for later versions:
- 📧 Email notifications on status change
- 🔔 In-app notifications
- 📊 Analytics dashboard
- 🔍 Advanced search filters
- 💼 Saved jobs
- 📱 Mobile app
- 📅 Interview scheduling
- 💬 Chat with HR

---

## ✅ CURRENT STATUS

| Feature | Status |
|---|---|
| Home page | ✅ Done |
| Job listings | ✅ Done |
| Job detail | ✅ Done |
| Login | ✅ Done |
| Signup | ✅ Done |
| Apply Form | ✅ Done |
| Thank You page | ✅ Done |
| Talent Pool | ⬜ Next |
| Admin Dashboard | ⬜ Pending |
| Deployment | ⬜ Pending |

---

**Keep this document updated as your project grows!**