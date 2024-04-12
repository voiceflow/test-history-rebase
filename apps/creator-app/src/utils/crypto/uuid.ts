export const isUUID4 = (uuid: string) => {
  // eslint-disable-next-line unicorn/better-regex
  return !!uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
};
