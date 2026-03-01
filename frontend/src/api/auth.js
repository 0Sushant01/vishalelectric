import api from './axios';

export const loginAdmin = async ({ phone_number, password }) => {
    try {
        const response = await api.post('accounts/login/', { phone_number, password });
        // Only allow Admin/Owner roles to log in through this portal
        const userRole = response.data.user?.role;
        if (userRole !== 'ADMIN' && userRole !== 'OWNER') {
            throw new Error('Unauthorized role. This portal is for Dashboard Administrators only.');
        }

        // Backend returned HttpOnly cookies automatically, we don't save to localStorage anymore!
        return response.data;
    } catch (error) {
        if (error.message.includes('Unauthorized role')) throw error;
        throw new Error(error.response?.data?.error || 'Failed to login. Please check your credentials.');
    }
};

export const logoutAdmin = async () => {
    try {
        // Backend knows which tokens to destroy from your included cookies
        await api.post('accounts/logout/');
    } catch (err) {
        console.error('Failed to log out cleanly', err);
    }
};

// New helper method to verify active session since we can't inspect localStorage anymore
export const getAuthStatus = async () => {
    try {
        const response = await api.get('accounts/auth-status/');
        return response.data; // { is_authenticated: true, user: {...} }
    } catch (error) {
        return { is_authenticated: false, user: null };
    }
};
