export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: {
    email: string;
    id: number;
    name: string;
  };
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}
export interface RegisterResponse {
  user: {
    email: string;
    id: number;
    name: string;
  };
}
