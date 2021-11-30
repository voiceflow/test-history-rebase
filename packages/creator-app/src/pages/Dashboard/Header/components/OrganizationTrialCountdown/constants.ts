export enum CountdownStatus {
  FULL = 'full',
  WARNING = 'warning',
  EXPIRED = 'expired',
}

interface CountdownColors {
  text: string;
  backgroundImage: string;
  boxShadow: string;
}

export const MIN_TRIAL_DAYS = 0;
export const TRIAL_DAYS_WARNING = 7;

export const COUNTDOWN_COLOR_MAP: Record<CountdownStatus, CountdownColors> = {
  [CountdownStatus.FULL]: {
    text: '#279745',
    boxShadow: '0 0 0 0.5px rgba(39, 151, 69, 0.16), inset 0 0 0 0.5px rgba(39, 151, 69, 0.16), inset 0 0 0 3px #fff',
    backgroundImage: 'linear-gradient(to bottom, rgba(39, 151, 69, 0.08), rgba(39, 151, 69, 0.12) 97%)',
  },
  [CountdownStatus.WARNING]: {
    text: '#e91e63',
    boxShadow: '0 0 0 0.5px rgba(233, 30, 99, 0.16), inset 0 0 0 0.5px rgba(233, 30, 99, 0.16), inset 0 0 0 3px #fff',
    backgroundImage: 'linear-gradient(to bottom, rgba(233, 30, 99, 0.08), rgba(233, 30, 99, 0.12) 97%)',
  },
  [CountdownStatus.EXPIRED]: {
    text: '#e91e63',
    boxShadow: '0 0 0 0.5px rgba(233, 30, 99, 0.16), inset 0 0 0 0.5px rgba(233, 30, 99, 0.16), inset 0 0 0 3px #fff',
    backgroundImage: 'linear-gradient(to bottom, rgba(233, 30, 99, 0.08), rgba(233, 30, 99, 0.12) 97%)',
  },
};
