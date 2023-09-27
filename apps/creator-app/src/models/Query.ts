import { BillingPeriod, PlanType } from '@voiceflow/internal';

export type Query = Query.Onboarding & Query.Dashboard & Query.Auth & Query.Canvas & Query.Okta & Query.SSO & Query.SSOError;

export namespace Query {
  export type Onboarding = Partial<{
    ob_plan: PlanType;
    ob_period: BillingPeriod;
    ob_payment: boolean;
    ob_seats: number;
    invite: string;
    email: string;
    choose_workspace: boolean;
  }>;

  export type Dashboard = Partial<{
    invite_collaborators: string;
    upgrade_workspace: string;
    import: string;
    plan: string;
  }>;

  export type Auth = Partial<{
    email: string;
    name: string;
    invite: string;
    invite_code: string;
    referral: string /* Referral code */;
    ref_code: string /* ReferralRock referral code */;
    inviteToken: string;
  }>;

  export type Canvas = Partial<{
    nodeID: string;
  }>;

  export type Okta = Partial<{
    code: string;
    state: string;
    error_description: string;
  }>;

  export type SSO = Partial<{
    token_type: string;
    is_new_user: string;
    access_token: string;
  }>;

  export type SSOError = Partial<{
    error: string;
    error_name: string;
    error_code: string;
  }>;
}
