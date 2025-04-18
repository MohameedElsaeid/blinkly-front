
import {apiClient} from './http/apiClient';
import {User} from '../types';
import {
    ForgotPasswordDto,
    IAuthResponse,
    LoginDto,
    ResetPasswordDto,
    SignUpDto,
    VerifyEmailDto,
    VerifyPhoneDto
} from '../types/auth';

class AuthService {
    async login(params: LoginDto): Promise<IAuthResponse> {
        try {
            console.log('AuthService login called with params:', params);
            // Call the login API endpoint
            const response = await apiClient.post<IAuthResponse>('/auth/login', params);
            console.log('Login API response:', response);

            // If login is successful, save the auth data
            if (response.success && response.user) {
                this.saveAuthData(response.user);
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(params: SignUpDto): Promise<IAuthResponse> {
        try {
            console.log('AuthService register called with params:', { ...params, password: '***HIDDEN***' });
            
            // Enhanced debugging for signup
            console.log('Current base URL:', import.meta.env.VITE_API_URL || 'https://api.blinkly.app');
            console.log('Signup endpoint:', '/auth/signup');
            
            // Add additional logging for request headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            console.log('Request headers:', headers);
            
            // Make the API call with explicit URL to ensure correct endpoint
            const response = await apiClient.post<IAuthResponse>('/auth/signup', params);
            console.log('Register API response:', response);

            if (response.success && response.user) {
                this.saveAuthData(response.user);
            }

            return response;
        } catch (error) {
            console.error('Registration error details:', error);
            // More detailed error logging
            if ((error as any).response) {
                console.error('Server response:', (error as any).response.data);
                console.error('Status code:', (error as any).response.status);
                console.error('Response headers:', (error as any).response.headers);
            } else if ((error as any).request) {
                console.error('No response received. Request details:', (error as any).request);
            } else {
                console.error('Error setting up request:', (error as any).message);
            }
            throw error;
        }
    }

    async forgotPassword(params: ForgotPasswordDto): Promise<IAuthResponse> {
        const response = await apiClient.post<IAuthResponse>('/auth/forgot-password', params);
        return response;
    }

    async resetPassword(params: ResetPasswordDto): Promise<IAuthResponse> {
        const response = await apiClient.post<IAuthResponse>('/auth/reset-password', params);
        return response;
    }

    async verifyPhone(params: VerifyPhoneDto): Promise<IAuthResponse> {
        const response = await apiClient.post<IAuthResponse>('/auth/verify-phone', params);
        return response;
    }

    async verifyEmail(params: VerifyEmailDto): Promise<IAuthResponse> {
        const response = await apiClient.post<IAuthResponse>('/auth/verify-email', params);
        return response;
    }

    async refreshToken(): Promise<string | null> {
        try {
            console.log('Attempting to refresh token');
            const response = await apiClient.post<{ success: boolean, user: { token: string } }>('/auth/refresh-token');
            console.log('Refresh token response:', response);
            
            if (response.success && response.user?.token) {
                console.log('Token refreshed successfully');
                localStorage.setItem('token', response.user.token);
                return response.user.token;
            }
            console.log('Failed to refresh token: Invalid response format');
            return null;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            this.logout();
            return null;
        }
    }

    logout(): void {
        console.log('Logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
    }

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private saveAuthData(user: any): void {
        console.log('Saving auth data:', { ...user, token: user.token ? '***HIDDEN***' : undefined });
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
    }
}

export const authService = new AuthService();
