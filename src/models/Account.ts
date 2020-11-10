import { AmazonProfile, AmazonVendor } from '@voiceflow/alexa-types';

export type Account = {
  email: string;
  name: string;
  creator_id: number;
  image: string;
  created: string;
  first_login?: boolean;
};

export type LockOwner = Account & {
  color?: string;
  tabID?: string;
};

export namespace Account {
  export type Amazon = {
    token: string;
    profile: AmazonProfile;
    vendors: AmazonVendor[];
  };

  export type Google = {
    token: string;
    profile: {
      id: string;
      email: string;
      verified_email: boolean;
      name: string;
      given_name: string;
      family_name: string;
      picture: string;
      locale: string;
      hd: string;
    };
  };
}
