import apiClient from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
