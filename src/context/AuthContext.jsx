'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.user) {
                setUser(data.user);
            }
            else {
                setUser(null);
            }
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        refreshUser();
    }, []);
    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return { success: false, error: data.error || 'Login failed' };
            }
            await refreshUser();
            return { success: true, user: data.user };
        }
        catch {
            return { success: false, error: 'Network error during login' };
        }
    };
    const signup = async (name, email, password) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return { success: false, error: data.error || 'Signup failed' };
            }
            await refreshUser();
            return { success: true };
        }
        catch {
            return { success: false, error: 'Network error during signup' };
        }
    };
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            window.location.href = '/login';
        }
        catch (err) {
            console.error('Logout error:', err);
        }
    };
    return (<AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
