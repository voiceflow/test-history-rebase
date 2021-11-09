import { Utils } from '@voiceflow/common';

const CHARACTERS = Array.from({ length: 26 }).map((_, index) => String.fromCharCode(97 + index));

interface Generate {
  oneOf: <T>(options: T[]) => T;

  number: (min?: number, max?: number) => number;

  id: (slug?: boolean) => string;

  string: (length?: number) => string;

  object: <T = string>(entryCount?: number, factory?: () => T) => Record<string, T>;

  array: <T = string>(length?: number, factory?: () => T) => T[];
}

// eslint-disable-next-line import/prefer-default-export
export const generate: Generate = {
  oneOf: (options) => options[generate.number(0, options.length - 1)],

  number: (min = 0, max = 100) => min + Math.floor(Math.random() * (max - min)),

  id: (slug = true) => (slug ? Utils.id.cuid.slug() : Utils.id.cuid()),

  string: (length = 10) =>
    Array.from({ length })
      .map(() => generate.oneOf(CHARACTERS))
      .join(''),

  object: (entryCount = 3, factory = generate.string as () => any) =>
    Array.from({ length: entryCount })
      .map<[string, any]>(() => [generate.string(), factory()])
      .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),

  array: (length = 3, factory = generate.string as () => any) => Array.from({ length }).map(() => factory()),
};
