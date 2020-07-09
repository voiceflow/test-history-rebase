import { BillingPeriod, PlanType } from '@/constants';

export type Query = Query.Onboarding & Query.Dashboard & Query.Register;

export namespace Query {
  export type Onboarding = Partial<{
    ob_plan: PlanType;
    ob_coupon: any;
    ob_period: BillingPeriod;
    invite: string;
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
  }>;
}
