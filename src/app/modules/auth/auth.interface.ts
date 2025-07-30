export interface ILoginPayload {
  phoneNumber: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}
