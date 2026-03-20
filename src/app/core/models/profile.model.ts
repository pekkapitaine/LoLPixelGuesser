export interface Profile {
  pseudo: string;
  avatar: string;
  theme: string;
}

export const DEFAULT_PROFILE: Profile = {
  pseudo: 'Invocateur',
  avatar: '🔥',
  theme: 'dark',
};
