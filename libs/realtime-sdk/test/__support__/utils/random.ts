import { faker } from '@faker-js/faker';

export const getRandomEnumElement = <T extends { [key: number]: string | number }>(obj: T): T[keyof T] =>
  faker.helpers.arrayElement(Object.values(obj)) as T[keyof T];

export const getRandomEnumElements = <T extends { [key: number]: string | number }>(obj: T): T[keyof T][] =>
  faker.helpers.arrayElements(Object.values(obj)) as T[keyof T][];
