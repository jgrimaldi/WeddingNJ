export type Language = 'ES' | 'EN';
export type Gender = 'female' | 'male';

export interface User {
  Name: string;
  Gender: Gender;
  Residency: 'Local' | 'Remote';
}

export interface Invitation {
  Language: Language;
  Guests: User[];
  CustomGreet: string;
}

// Root object keyed by code
export type InvitationsByCode = Record<string, Invitation>;
