export const getProductsLink = (projectId, search = window.location.search) =>
  `/projects/${projectId}/products${search}`;

export const getProductLink = (projectId, productId, search = window.location.search) =>
  `/projects/${projectId}/products/${productId}${search}`;

export const getCreateProductLink = projectId =>
  `/projects/${projectId}/products/create?version=dev`;

export const getProductPurchaseType = item => {
  if (item.purchaseType === 'subscription') {
    const subscription =
      item.subscriptionPaymentFrequency === 'monthly'
        ? 'Monthly subscription'
        : 'Yearly subscription';

    if (item.subscriptionTrialPeriodDays) {
      return `${subscription}, ${item.subscriptionTrialPeriodDays} days trial`;
    }

    return subscription;
  } else if (item.purchaseType === 'consumable') {
    return `Consumable, ${item.consumableUnits} units per purchase`;
  }

  return 'One-time purchase';
};

export const getProductPrice = value => (value ? `${(value / 100).toFixed(2)}` : '');

export const getProductIdWithSubscription = products => {
  const product = Object.values(products).find(p => p.purchaseType === 'subscription');

  return product && product.id;
};
