export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface RegisterResponse {
  success: boolean;
  data: User;
}