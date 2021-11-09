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
