import * as fetch from '@voiceflow/fetch';
import * as undici from 'undici';

export type FetchClient = fetch.FetchClient<undici.RequestInit, undici.Request | URL, undici.Response>;
