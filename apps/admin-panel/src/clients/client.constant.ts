import { cookies } from 'next/headers';

export const AUTH_HEADERS = {
  get Authorization() {
    return `Bearer ${cookies().get('auth-token')?.value}`;
  },
};
