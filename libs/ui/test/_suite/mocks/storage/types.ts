import { Mock } from 'vitest';

export interface Storage {
  (name: 'localStorage' | 'sessionStorage', getter?: (key: string) => string): {
    getItem: Mock<[key: string], string | undefined>;
    setItem: Mock<[key: string, value: string], undefined>;
  };
}
