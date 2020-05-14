import { BillingPeriod, PlanType } from '@/constants';

export type Query = Query.Onboarding & Query.Dashboard & Query.Register;

export namespace Query {
  export type Onboarding = {
    ob_plan?: PlanType;
    ob_coupon?: any;
    ob_period?: BillingPeriod;
    invite?: string;
  };

  export type Dashboard = {
    invite_collaborators?: string;
    upgrade_workspace?: string;
  };

  export type Register = {
    email?: string;
    name?: string;
    coupon?: string;
  };
}
