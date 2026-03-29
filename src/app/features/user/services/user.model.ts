export interface UserType {
  id: number;
  name: string;
  displayName: string;
}

export interface UserListItem {
  id: number;
  email: string;
  personName: string;
  idUserType: number;
  userType: string;
  active: boolean;
}

export interface UserListResponse {
  content: UserListItem[];
  totalElements: number;
}

export interface UserDetail {
  id: number;
  personName: string;
  personCpf: string;
  personEmail: string;
  nameUserType: string;
  active: boolean;
}

export interface UpdateUserTypeRequest {
  idUserType: number;
}
