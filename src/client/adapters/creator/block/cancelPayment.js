import { createBlockAdapter } from './utils';

const cancelPaymentBlockAdapter = createBlockAdapter(
  ({ product_id }) => ({
    productID: product_id,
  }),
  ({ productID }) => ({
    product_id: productID,
  })
);

export default cancelPaymentBlockAdapter;
