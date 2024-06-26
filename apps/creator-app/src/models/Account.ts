export interface Account {
  email: string;
  name: string;
  verified: boolean;
  creator_id: number;
  image?: string | null;
  created: string;
  first_login?: boolean;
  gid?: string;
  fid?: string;
  okta_id?: string;
  saml_provider_id?: string;
}
