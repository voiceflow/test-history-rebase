// eslint-disable-next-line import/prefer-default-export
export const getKeys = <T>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];
