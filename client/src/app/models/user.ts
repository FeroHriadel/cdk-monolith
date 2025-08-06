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
  UserName: string;
  Email: string;
  Password: string;
}