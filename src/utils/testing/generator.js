const CHARACTERS = Array(26)
  .fill(0)
  .map((_, index) => String.fromCharCode(97 + index));

// eslint-disable-next-line import/prefer-default-export
export const generate = {
  number: (min = 0, max = 100) => min + Math.floor(Math.random() * (max - min)),

  string: (length = 10) =>
    Array(generate.number(0, length))
      .fill(0)
      .map(() => CHARACTERS[generate.number(0, CHARACTERS.length - 1)])
      .join(''),

  object: (entryCount = 3, factory = generate.string) =>
    Array(entryCount)
      .fill(0)
      .map(() => [generate.string(), factory()])
      .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),

  array: (length = 3, factory = generate.string) =>
    Array(length)
      .fill(0)
      .map(() => factory()),
};
