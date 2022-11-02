import { createDividerMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';

interface listItemProps {
  value: string;
}

export const createPreferredOptionsList = <T extends listItemProps>(list: T[], preferredItems: string[] = []): (T | UIOnlyMenuItemOption)[] => {
  const preferred: T[] = [];
  const notPreferred: T[] = [];
  list.forEach((item) => {
    if (item.value && preferredItems.includes(item.value)) {
      preferred.push(item);
    } else {
      notPreferred.push(item);
    }
  });
  return [...preferred, createDividerMenuItemOption(), ...notPreferred];
};
