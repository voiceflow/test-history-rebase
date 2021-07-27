export type { AnyProject, DBProject, Project } from '@voiceflow/realtime-sdk';

export interface Price {
  price: number;
  errors: {
    coupon?: {
      message: string;
    };
    seats?: {
      message: string;
    };
    period?: {
      message: string;
    };
  };
  discount?: {};
}
