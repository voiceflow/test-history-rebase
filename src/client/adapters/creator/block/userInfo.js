import { createBlockAdapter } from './utils';

const userInfoBlockAdapter = createBlockAdapter(
  ({ permissions }) => ({
    permissions: permissions.map(({ selected, map_to, product, transaction }) => ({
      selected: selected ? selected.value : null,
      mapTo: map_to ? map_to.value : null,
      mapToLabel: map_to ? map_to.label : null,
      product: product ? product.value : null,
      transaction,
    })),
  }),
  ({ permissions }) => ({
    permissions: permissions.map(({ selected, mapTo, mapToLabel, product, transaction }) => {
      const permission = {
        selected: {
          value: selected,
        },
        map_to: {
          label: mapToLabel,
          value: mapTo,
        },
      };
      if (product) {
        permission.product = { value: product };
      } else {
        delete permission.product;
      }
      if (transaction) {
        permission.transaction = transaction;
      } else {
        delete permission.transaction;
      }

      return permission;
    }),
  })
);

export default userInfoBlockAdapter;
