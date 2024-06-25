import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getCookieByName = <R = string>(name: string, options?: CookieGetOptions): R => cookies.get(name, options);

export const getAllCookies = () => cookies.getAll();

export const removeCookie = (key: string, options?: CookieSetOptions) => cookies.remove(key, options);

export const setCookie = (key: string, value: string, options?: CookieSetOptions) =>
  cookies.set(key, value, { sameSite: 'strict', ...options });
