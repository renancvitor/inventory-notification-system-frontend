export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nameUserType: string;
    personName: string;
    personEmail: string;
  };
  firstAccess: boolean;
}
