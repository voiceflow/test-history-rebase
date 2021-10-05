export interface AccountState {
  loading: boolean;
  email: string | null;
  name: string | null;
  // eslint-disable-next-line camelcase
  creator_id: number | null;
  internalAdmin: boolean;
  image: string | null;
  vendors: string[];
}
