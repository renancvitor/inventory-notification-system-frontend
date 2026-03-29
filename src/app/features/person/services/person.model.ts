export interface PersonFormValue {
  personName: string;
  email: string;
  cpf: string;
}

export interface PersonDetail {
  id: number;
  personName: string;
  cpf: string;
  email: string;
  registrationDate: string;
  active: boolean;
}

export interface PersonListItem extends PersonDetail {}

export interface PersonListResponse {
  content: PersonListItem[];
  totalElements: number;
}

export interface PersonCreatePayload {
  person: PersonFormValue;
  user: null;
}
