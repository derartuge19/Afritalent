import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Job {
    id: number;
    title: string;
    description: string;
    requirements?: string;
    location?: string;
    salary_range?: string;
    job_type?: string;
    status: string;
    views: number;
    applicants_count: number;
    created_at: string;
    employer?: {
        id: number;
        company_name: string;
        industry?: string;
        location?: string;
    };
}

export const getJobs = async (limit: number = 20, filters?: {
    search?: string;
    location?: string;
    job_type?: string;
    experience_level?: string;
    salary_min?: number;
}) => {
    const params = { limit, ...filters };
    const response = await api.get<Job[]>('/jobs/', { params });
    return response.data;
};

export interface Application {
    id: number;
    job_id: number;
    seeker_id: number;
    status: string;
    match_score: number;
    applied_at: string;
    cover_letter?: string;
    job?: Job;
    seeker?: SeekerProfile;
    cv?: CV;
}

export interface SeekerAnalytics {
    applications: number;
    interviews: number;
    profile_views: number;
    saved_jobs: number;
}

export const getMyApplications = async () => {
    const response = await api.get<Application[]>('/applications/me');
    return response.data;
};

export const getSeekerAnalytics = async () => {
    const response = await api.get<SeekerAnalytics>('/analytics/seeker');
    return response.data;
};

export const applyToJob = async (job_id: number, cover_letter?: string, cv_id?: number) => {
    const response = await api.post<Application>('/applications/', { job_id, cover_letter, cv_id });
    return response.data;
};

export interface SavedJob {
    id: number;
    job_id: number;
    seeker_id: number;
    created_at: string;
    job?: Job;
}

export const getSavedJobs = async () => {
    const response = await api.get<SavedJob[]>('/saved-jobs/');
    return response.data;
};

export const saveJob = async (job_id: number) => {
    const response = await api.post<SavedJob>('/saved-jobs/', { job_id });
    return response.data;
};

export const unsaveJob = async (job_id: number) => {
    await api.delete(`/saved-jobs/${job_id}`);
};

export interface SkillsAnalytics {
    skills_data: Array<{ skill: string; level: number; demand: number }>;
    radar_data: Array<{ subject: string; A: number; fullMark: number }>;
    market_trends: Array<{ skill: string; trend: number; direction: string }>;
    recommended_courses: Array<{
        id: string;
        title: string;
        provider: string;
        duration: string;
        level: string;
        relevance: number;
        image: string;
        link: string;
    }>;
    metrics: Array<{
        title: string;
        value: string;
        trend: number;
        color: string;
    }>;
}

export const getSkillsAnalytics = async () => {
    const response = await api.get<SkillsAnalytics>('/analytics/skills');
    return response.data;
};

export interface SeekerProfile {
    id: number;
    user_id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    phone: string | null;
    cv_url: string | null;
    cv_html: string | null;
    skills: string | null;
    education: string | null;
    experience: string | null;
    job_type: string | null;
    work_mode: string | null;
    experience_level: string | null;
    min_salary: string | null;
    preferred_locations: string | null;
    completion_percentage: number;
    completion_status: string;
    has_cv: boolean;
    settings?: {
        email_job_alerts: boolean;
        email_application_updates: boolean;
        email_weekly_digest: boolean;
        push_job_alerts: boolean;
        push_messages: boolean;
        sms_interviews: boolean;
        profile_visible: boolean;
        show_salary: boolean;
        allow_messages: boolean;
        show_activity: boolean;
    };
}

export const getSeekerProfile = async () => {
    const response = await api.get<SeekerProfile>('/seeker-profile/me');
    return response.data;
};

export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    email?: string;
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    skills?: string;
    education?: string;
    experience?: string;
    cv_html?: string;
    job_type?: string;
    work_mode?: string;
    experience_level?: string;
    min_salary?: string;
    preferred_locations?: string;
}

export const updateSeekerProfile = async (data: ProfileUpdateData) => {
    const response = await api.put('/seeker-profile/me', data);
    return response.data;
};

export interface CareerGuidance {
    career_paths: Array<{
        id: string;
        title: string;
        match: number;
        timeline: string;
        salary: string;
        ai_insight: string;
        skills: Array<{ name: string; url: string }>;
        description: string;
    }>;
    interview_tips: string[];
    common_questions: Array<{
        question: string;
        category: string;
        hint: string;
    }>;
    interview_resources: Array<{
        id: string;
        title: string;
        type: string;
        duration: string;
        icon: string;
        color: string;
        url: string;
    }>;
}

export const getCareerGuidance = async () => {
    const response = await api.get<CareerGuidance>('/analytics/career');
    return response.data;
};

export interface EmployerAnalytics {
    active_jobs: number;
    total_applicants: number;
    interviews: number;
    job_views: number;
    application_trends: Array<{ name: string; value: number }>;
    recent_applicants: Array<{
        name: string;
        role: string;
        match: string;
        date: string;
    }>;
}

export const getEmployerAnalytics = async () => {
    const response = await api.get<EmployerAnalytics>('/analytics/employer');
    return response.data;
};

export const getMyJobs = async () => {
    const response = await api.get<Job[]>('/jobs/my-jobs');
    return response.data;
};

export const createJob = async (jobData: any) => {
    const response = await api.post<Job>('/jobs/', jobData);
    return response.data;
};

export const updateJobStatus = async (jobId: number, status: string) => {
    const response = await api.patch<Job>(`/jobs/${jobId}/status`, { status });
    return response.data;
};

export const getEmployerApplications = async (jobId?: number, status?: string) => {
    const params: any = {};
    if (jobId) params.job_id = jobId;
    if (status) params.status = status;
    const response = await api.get<Application[]>('/applications/employer', { params });
    return response.data;
};

export const updateApplicationStatus = async (applicationId: number, status: string) => {
    const response = await api.patch<Application>(`/applications/${applicationId}/status`, { status });
    return response.data;
};

export interface EmployerProfile {
    id: number;
    user_id: number;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    company_name: string | null;
    industry: string | null;
    location: string | null;
    description: string | null;
    logo_url: string | null;
}

export const getEmployerProfile = async () => {
    const response = await api.get<EmployerProfile>('/employer-profile/me');
    return response.data;
};

export const updateEmployerProfile = async (data: Partial<EmployerProfile>) => {
    const response = await api.put<EmployerProfile>('/employer-profile/me', data);
    return response.data;
};

// --- CV API ---
export interface CV {
    id: number;
    seeker_id: number;
    title: string;
    content_html?: string;
    content_json?: string;
    file_url?: string;
    is_uploaded: boolean;
    is_primary: boolean;
    created_at: string;
}

export interface CVCreateData {
    title: string;
    content_html?: string;
    content_json?: string;
    file_url?: string;
    is_uploaded?: boolean;
    is_primary?: boolean;
}

export const getCVs = async () => {
    const response = await api.get<CV[]>('/cvs/');
    return response.data;
};

export const createCV = async (data: CVCreateData) => {
    const response = await api.post<CV>('/cvs/', data);
    return response.data;
};

export const uploadCV = async (file: File, title: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    // axios handles multipart/form-data when passing FormData
    const response = await api.post<CV>('/cvs/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getCV = async (id: number) => {
    const response = await api.get<CV>(`/cvs/${id}`);
    return response.data;
};

export const deleteCV = async (id: number) => {
    const response = await api.delete(`/cvs/${id}`);
    return response.data;
};

export const updateCV = async (id: number, data: Partial<CVCreateData>) => {
    const response = await api.patch<CV>(`/cvs/${id}`, data);
    return response.data;
};

export const setPrimaryCV = async (id: number) => {
    const response = await api.post<CV>(`/cvs/${id}/set-primary`);
    return response.data;
};

// --- Interview API ---
export interface InterviewHistory {
    id: number;
    user_id: number;
    message?: string;
    status_at_time: string;
    created_at: string;
}

export interface Interview {
    id: number;
    application_id: number;
    employer_id: number;
    seeker_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    seeker_notes?: string;
    status: string;
    created_at: string;
    history: InterviewHistory[];
    application?: Application;
}

export interface InterviewCreateData {
    application_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
}

export const scheduleInterview = async (data: InterviewCreateData) => {
    const response = await api.post<Interview>('/interviews/', data);
    return response.data;
};

export const getInterviews = async () => {
    const response = await api.get<Interview[]>('/interviews/me');
    return response.data;
};

export const respondToInterview = async (interviewId: number, status: 'accepted' | 'declined' | 'reschedule_requested', notes?: string) => {
    const response = await api.put<Interview>(`/interviews/${interviewId}/respond?status=${status}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`);
    return response.data;
};

export const updateInterview = async (id: number, data: Partial<InterviewCreateData> & { status?: string }) => {
    const response = await api.put<Interview>(`/interviews/${id}`, data);
    return response.data;
};

export const deleteInterview = async (id: number) => {
    await api.delete(`/interviews/${id}`);
};

// --- Notifications API ---
export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export const getNotifications = async () => {
    const response = await api.get<Notification[]>('/notifications/');
    return response.data;
};

export const markNotificationRead = async (id: number) => {
    const response = await api.put<Notification>(`/notifications/${id}/read`);
    return response.data;
};

// --- Settings API ---
export interface UserSettings {
    email_job_alerts: boolean;
    email_application_updates: boolean;
    email_new_applicants: boolean;
    email_interview_responses: boolean;
    email_weekly_digest: boolean;
    push_job_alerts: boolean;
    push_messages: boolean;
    sms_interviews: boolean;
    profile_visible: boolean;
    show_salary: boolean;
    allow_messages: boolean;
    show_activity: boolean;
}

export const getSettings = async () => {
    const response = await api.get<UserSettings>('/settings/');
    return response.data;
};

export const updateSettings = async (data: Partial<UserSettings>) => {
    const response = await api.put<UserSettings>('/settings/', data);
    return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/settings/change-password', {
        current_password: currentPassword,
        new_password: newPassword
    });
    return response.data;
};
