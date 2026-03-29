export interface UserDetail {
  id: number;
  personName: string;
  personCpf: string;
  personEmail: string;
  nameUserType: string;
  active: boolean;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
