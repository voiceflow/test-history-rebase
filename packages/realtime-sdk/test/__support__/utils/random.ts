import { random } from 'faker';

export const getRandomEnumElement = <T extends { [key: number]: string | number }>(obj: T): T[keyof T] =>
  random.arrayElement(Object.values(obj)) as T[keyof T];

export const getRandomEnumElements = <T extends { [key: number]: string | number }>(obj: T): T[keyof T][] =>
  random.arrayElements(Object.values(obj)) as T[keyof T][];
