export type UserRole = 'user' | 'agent' | 'admin';

export interface IUser {
  name: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  isAgentApproved?: boolean;
  email?: string;
}

export interface isBlocked {
  type: Boolean,
  default: false,
}

export enum Role {
  user = 'user',
  admin = 'admin',
  agent = 'agent',
}