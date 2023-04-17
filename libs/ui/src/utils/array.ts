export const conditionalItem = <T>(condition: boolean, ...items: T[]): T[] => (condition ? items : []);
