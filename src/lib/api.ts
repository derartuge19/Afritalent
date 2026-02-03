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
    employer_id: number;
    status: string;
    created_at: string;
    employer?: {
        id: number;
        company_name: string;
        industry?: string;
        location?: string;
    };
}

export const getJobs = async (limit: number = 3) => {
    const response = await api.get<Job[]>(`/jobs/?limit=${limit}`);
    return response.data;
};

export interface Application {
    id: number;
    job_id: number;
    seeker_id: number;
    status: string;
    match_score: number;
    applied_at: string;
    job?: Job; // If the backend returns nested job info, which we defined in schema
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
    skills: string | null;
    education: string | null;
    experience: string | null;
    completion_percentage: number;
    completion_status: string;
    has_cv: boolean;
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
