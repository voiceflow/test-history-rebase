export interface AccountState {
  loading: boolean;
  email: string | null;
  name: string | null;
  id: number | null;
  internalAdmin: boolean;
  image: string | null;
  vendors: string[];
}
