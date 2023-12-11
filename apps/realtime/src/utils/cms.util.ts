import uniqBy from 'lodash/uniqBy';

export const uniqCMSResourceIDs = (items: { id: string; environmentID: string }[]) =>
  uniqBy(items, ({ id, environmentID }) => `${environmentID}-${id}`);
