import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {

    const storageToken = localStorage.getItem('@EcoScheduler:token');
    const storageUser = localStorage.getItem('@EcoScheduler:user');

    return {
        user: storageUser ? JSON.parse(storageUser) : null,
        token: storageToken,
        isAuthenticated: !!storageToken,

        login: (user, token) => {
            localStorage.setItem('@EcoScheduler:token', token);
            localStorage.setItem('@EcoScheduler:user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true });

        },
        logout: () => {
            localStorage.removeItem('@EcoScheduler:token');
            localStorage.removeItem('@EcoScheduler:user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});