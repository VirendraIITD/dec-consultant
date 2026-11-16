import { supabase } from './supabaseClient';

// ==========================================
// 🎯 1. AUTHENTICATION API (The Bouncer)
// ==========================================
export const authAPI = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  
  async logout() {
    await supabase.auth.signOut();
  },
  
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  },
  
  async signUp(email, password, fullName) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    
    if (authData.user) {
      await supabase.from('profiles').insert({
        id: authData.user.id, email, full_name: fullName, role: 'candidate'
      });
    }
    return authData;
  }
};

// ==========================================
// 🎯 2. JOBS API (The Job Manager)
// ==========================================
export const jobsAPI = {
  async getAllActive() {
    const { data, error } = await supabase
      .from('jobs').select('*').eq('status', 'active').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async getById(id) {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  async create(jobData) {
    const { data, error } = await supabase.from('jobs').insert(jobData).select().single();
    if (error) throw error;
    return data;
  },
  
  async update(id, updates) {
    const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  async delete(id) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  async getAllWithAppCount() {
    // Get jobs
    const { data: jobs, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    // Get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const { count } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('job_id', job.id);
        return { ...job, application_count: count || 0 };
      })
    );
    return jobsWithCounts;
  }
};

// ==========================================
// 🎯 3. APPLICATIONS API (The Resume Reviewer)
// ==========================================
export const applicationsAPI = {
  async submit(applicationData) {
    const { data, error } = await supabase.from('applications').insert(applicationData).select().single();
    if (error) throw error;
    return data;
  },
  
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs (title, category, location)') // Join with jobs table
      .order('applied_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async updateStatus(id, status) {
    const { data, error } = await supabase.from('applications').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

// ==========================================
// 🎯 4. TALENT POOL API (The Passive Candidate Manager)
// ==========================================
export const talentPoolAPI = {
  async submit(profileData) {
    const { data, error } = await supabase.from('talent_pool').insert(profileData).select().single();
    if (error) throw error;
    return data;
  },
  
  async getAll() {
    const { data, error } = await supabase.from('talent_pool').select('*').order('submitted_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async updateStatus(id, status) {
    const { data, error } = await supabase.from('talent_pool').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

// ==========================================
// 🎯 5. STORAGE API (The Filing Cabinet)
// ==========================================
export const storageAPI = {
  async uploadResume(file, folderPath = '') {
    const fileName = `${folderPath}${folderPath ? '/' : ''}${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file);
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);
    return data.publicUrl;
  }
};

// ==========================================
// 🎯 6. DASHBOARD API (The Statistician)
// ==========================================
export const dashboardAPI = {
  async getStats() {
    const [jobsRes, appsRes, tpRes, pendingRes] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('talent_pool').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      jobs: jobsRes.count || 0,
      applications: appsRes.count || 0,
      talentPool: tpRes.count || 0,
      pending: pendingRes.count || 0,
    };
  },
  
  async getRecentApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('id, full_name, email, status, applied_at, job_id, jobs(title)')
      .order('applied_at', { ascending: false })
      .limit(5);
    if (error) throw error;
    return data;
  }
};