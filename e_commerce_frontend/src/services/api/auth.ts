import apiClient from './client';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresAt?: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  role?: string;
}

export interface RegisterResponse {
  message?: string;
  success?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}


export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/Auth/login', credentials);
      
      console.log('Login API Response:', response.data);
      
      const data = response.data;
      
      if (!data.accessToken) {
        throw new Error('No access token received from server');
      }
      
      const token = data.accessToken;
      
      const decodedToken = decodeJWT(token);
      console.log('Decoded JWT:', decodedToken);
      
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                     decodedToken['nameid'] || 
                     decodedToken['sub'] ||
                     '';
      
      const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                       decodedToken['unique_name'] || 
                       data.username ||
                       credentials.email;
      
      const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
                    decodedToken['email'] || 
                    credentials.email;
      
      let role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                 decodedToken['role'] || 
                 data.role || 
                 'user';
      
      role = role.toLowerCase();
      
      const user: User = {
        id: userId,
        email: email,
        name: username,
        role: role === 'admin' ? 'admin' : 'user'
      };
      
      return {
        token: token,
        user: user,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post('/Auth/register', userData);
      
      console.log('Register API Response:', response.data);
      
      if (response.data && (response.data.success === false || response.data.message?.includes('error'))) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
            error.response.data?.title || 
            error.response.data?.errors?.join(', ') ||
            'Registration failed. Please try again.';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/Auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/Auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};



const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};