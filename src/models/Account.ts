export type Account = {
  email: string;
  name: string;
  creator_id: number;
  image: string;
};

export namespace Account {
  export type Amazon = {
    vendors: { id: string; name: string }[];
  };

  export type Google = {};
}
