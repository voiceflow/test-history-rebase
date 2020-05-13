export type Account = {
  email: string;
  name: string;
  creator_id: number;
  image: string;
  created: string;
};

export namespace Account {
  export type Amazon = {
    token: string;
    profile: {
      user_id: string;
      name: string;
      email: string;
    };
    vendors: Amazon.Vendor[];
  };

  export namespace Amazon {
    export type Vendor = {
      id: string;
      name: string;
      roles: string[];
    };
  }

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
