import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
    id: number;
    email: string;
    role: 'seeker' | 'employer' | 'admin';
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: any;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser().then((userData) => {
                if (userData) refreshProfile(userData);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            console.log('Fetching current user...');
            const response = await api.get('/auth/me');
            console.log('User fetched successfully:', response.data);
            setUser(response.data);
            return response.data as User;
        } catch (error: any) {
            console.error('Failed to fetch user:', error.response?.data || error.message);
            logout();
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async (userData?: User) => {
        const currentUser = userData || user;
        if (!currentUser) return;
        try {
            let profileData;
            if (currentUser.role === 'seeker') {
                const response = await api.get('/seeker-profile/me');
                profileData = response.data;
            } else if (currentUser.role === 'employer') {
                const response = await api.get('/employer-profile/me');
                profileData = response.data;
            }
            setProfile(profileData);
        } catch (error) {
            console.error('Failed to refresh profile:', error);
        }
    };

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        setIsLoading(true);
        const userData = await fetchUser();
        if (userData) {
            await refreshProfile(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, profile, login, logout, refreshProfile, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
