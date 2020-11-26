import { BillingPeriod, PlanType, PromoType } from '@/constants';

export type Query = Query.Onboarding & Query.Dashboard & Query.Register & Query.Canvas & Query.Okta;

export namespace Query {
  export type Onboarding = Partial<{
    ob_plan: PlanType;
    ob_coupon: any;
    ob_period: BillingPeriod;
    ob_payment: boolean;
    ob_seats: number;
    invite: string;
    email: string;
    choose_workspace: boolean;
    promo: PromoType;
  }>;

  export type Dashboard = Partial<{
    invite_collaborators: string;
    upgrade_workspace: string;
    import: string;
    plan: string;
  }>;

  export type Register = Partial<{
    email: string;
    name: string;
    coupon: string;
    invite: string;
    invite_code: string;
    code: string /* Referral code */;
  }>;

  export type Canvas = Partial<{
    thread: string;
    nodeID: string;
  }>;

  export type Okta = Partial<{
    code: string;
    state: string;
    error_description: string;
  }>;
}
