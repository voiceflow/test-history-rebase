import * as fetch from '@voiceflow/fetch';
import * as undici from 'undici';

export type FetchClient = fetch.FetchClient<undici.RequestInit, undici.Request | URL, undici.Response>;

export const MAX_CACHE_AGE = 8 * 60 * 60 * 1000; // 8 hours
export const MAX_CACHE_SIZE = 1000;
