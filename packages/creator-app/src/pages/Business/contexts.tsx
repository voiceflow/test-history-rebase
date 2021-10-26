import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { useCurried } from '@/hooks';
import { Product } from '@/models';

export interface ProductContextValue {
  product: Product;
  patchProduct: (data: Partial<Product>) => void;
  setProductProperty: <K extends keyof Product>(key: K) => (value: NonNullable<Product[K]>) => void;
}

export const ProductContext = React.createContext<ProductContextValue | null>(null);
export const { Consumer: ProductConsumer } = ProductContext;

export type ProductProviderProps = Pick<ProductContextValue, 'product' | 'patchProduct'>;

export const ProductProvider: React.FC<ProductProviderProps> = React.memo(({ product, patchProduct, children }) => {
  const setProductProperty = useCurried(<K extends keyof Product>(key: K, value: Product[K]) => patchProduct({ [key]: value }), [patchProduct]);

  const api = useContextApi({ product, patchProduct, setProductProperty } as ProductContextValue);

  return <ProductContext.Provider value={api}>{children}</ProductContext.Provider>;
});
