import { createBlockAdapter } from './utils';

const paymentBlockAdapter = createBlockAdapter(
  ({ product_id }) => ({
    productID: product_id || null,
  }),
  ({ productID }) => ({
    product_id: productID,
  })
);

export default paymentBlockAdapter;
