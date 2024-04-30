import type { Mock } from 'vitest';

export interface Response {
  body: string;
  error?: string;
  status: number;
}

export interface Fetch {
  (
    ...responses: Response[]
  ): Mock<
    [input: RequestInfo | URL, init?: RequestInit | undefined],
    Promise<{ status: number; text: () => Promise<string> }>
  >;
}
