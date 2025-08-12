export interface User {
  data: {
    token: string;
    userName: string;
    email: string;
    id: number;
    roles: string[];
    lastActive: string;
    createdAt: string;
    updatedAt: string;
  }
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