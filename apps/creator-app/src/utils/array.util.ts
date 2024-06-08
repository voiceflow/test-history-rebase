export const conditionalArrayItems = <T>(condition: boolean, ...items: T[]): T[] => (condition ? items : []);
