import { Types } from '@voiceflow/alexa-types';

export interface Account {
  email: string;
  name: string;
  creator_id: number;
  image?: string;
  password?: string;
  created: string;
  first_login?: boolean;
  referrer_id?: number;
  referral_code?: string;
}

export type LockOwner = Account & {
  color?: string;
  tabID?: string;
};

export namespace Account {
  export interface Amazon {
    token: string;
    profile: Types.AmazonProfile;
    vendors: Types.AmazonVendor[];
  }

  export interface Google {
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
  }
}
