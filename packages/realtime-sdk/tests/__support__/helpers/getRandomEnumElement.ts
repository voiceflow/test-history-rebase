import { random } from 'faker';

const getRandomEnumElement = <T extends { [key: number]: string | number }>(obj: T): T[keyof T] =>
  random.arrayElement(Object.values(obj)) as T[keyof T];

export default getRandomEnumElement;
