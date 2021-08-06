export interface StripeProduct {
  id: string;
  object: string;
  active: boolean;
  attributes: unknown[];
  created: string | null;
  description: string | null;
  images: string[];
  livemode: boolean;
  metadata: any;
  name: string;
  statement_descriptor: string | null;
  unit_label: string | null;
  updated: number;
}
