export type ReferralForm = {
  code: string;
  coupon: string;
  product: string;
  redemptionLimit: number | null;
  expiry?: string;
  status: boolean;
  creatorID: number | null;
};

export type ReferralContextAPI = {
  state: ReferralForm;
  actions: any;
};
