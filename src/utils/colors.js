import { PROFILE_COLORS } from '@/styles/colors';

// eslint-disable-next-line import/prefer-default-export
export const getAlternativeColor = (id) => {
  const index =
    String(id)
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((acc, code) => acc + code) % PROFILE_COLORS.length;

  return PROFILE_COLORS[index];
};
