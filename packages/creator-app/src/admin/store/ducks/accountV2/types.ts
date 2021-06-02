export type AccountState = {
  loading: boolean;
  email: string | null;
  name: string | null;
  creator_id: number | null;
  admin: number;
  image: string | null;
  vendors: string[];
};
