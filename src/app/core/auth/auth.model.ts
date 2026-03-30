export type UserTypeName = 'ADMIN' | 'PRODUCT_MANAGER' | 'COMMON';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  nameUserType: UserTypeName | string;
  personName: string;
  personEmail: string;
  firstAccess: boolean;
}

export type LoginResponse = AuthenticatedUser;
