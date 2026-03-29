export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  nameUserType: string;
  personName: string;
  personEmail: string;
  firstAccess: boolean;
}

export type LoginResponse = AuthenticatedUser;
