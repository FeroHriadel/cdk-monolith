export interface User {
    // token: string; //comes in 'Authorization' cookie
    userName: string;
    email: string;
    id: number;
    roles: string[];
    lastActive: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserLoginResponse {
  data: {
    userName: string;
    email: string;
    id: number;
    roles: string[];
    lastActive: string;
    createdAt: string;
    updatedAt: string;
  },
  statusCode: number;
  message: string;
}

export interface UserLoginRequest {
  Email: string;
  Password: string;
}

export interface UserSignupRequest {
  Email: string;
  Password: string;
  UserName: string;
}