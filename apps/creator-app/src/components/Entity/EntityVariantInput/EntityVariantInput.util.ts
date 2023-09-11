const COMMA_REGEX = /,/g;

export const isSynonymsStringEmpty = (value: string) => !value.replace(COMMA_REGEX, '').trim();
