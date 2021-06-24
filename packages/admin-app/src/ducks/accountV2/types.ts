export type AccountState = {
  loading: boolean;
  email: string | null;
  name: string | null;
  // eslint-disable-next-line camelcase
  creator_id: number | null;
  admin: number;
  image: string | null;
  vendors: string[];
};
