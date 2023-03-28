export interface Account {
  token: string;
  profile: {
    id: string;
    hd: string;
    name: string;
    email: string;
    locale: string;
    picture: string;
    given_name: string;
    family_name: string;
    verified_email: boolean;
  };
}
