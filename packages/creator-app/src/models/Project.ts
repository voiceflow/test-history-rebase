export interface Price {
  price: number;

  errors: {
    seats?: { message: string };
    coupon?: { message: string };
    period?: { message: string };
  };

  discount?: {
    type: string;
    value: number;
    message: string;
  };
}
