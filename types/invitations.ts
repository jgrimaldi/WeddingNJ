export type Language = 'ES' | 'EN';
export type Gender = 'female' | 'male';

export interface User {
  Name: string;
  Gender: Gender;
}

export interface Invitation {
  Language: Language;
  Residency: 'Local' | 'Remote' | 'RemoteLocal';
  Guests: User[];
  CustomGreet: string;
}

// Root object keyed by code
export type InvitationsByCode = Record<string, Invitation>;
