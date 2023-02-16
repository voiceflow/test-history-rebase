import * as Realtime from '@voiceflow/realtime-sdk';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { useCurried } from '@/hooks';

export interface ProductContextValue {
  product: Realtime.Product;
  patchProduct: (data: Partial<Realtime.Product>) => void;
  setProductProperty: <K extends keyof Realtime.Product>(key: K) => (value: NonNullable<Realtime.Product[K]>) => void;
  setProductPropertyNullable: <K extends keyof Realtime.Product>(key: K) => (value: Realtime.Product[K]) => void;
}

export const ProductContext = React.createContext<ProductContextValue | null>(null);
export const { Consumer: ProductConsumer } = ProductContext;

export type ProductProviderProps = React.PropsWithChildren<Pick<ProductContextValue, 'product' | 'patchProduct'>>;

export const ProductProvider: React.FC<ProductProviderProps> = React.memo(({ product, patchProduct, children }) => {
  const setProductProperty = useCurried(
    <K extends keyof Realtime.Product>(key: K, value: Realtime.Product[K]) => patchProduct({ [key]: value }),
    [patchProduct]
  );

  const api = useContextApi({ product, patchProduct, setProductProperty, setProductPropertyNullable: setProductProperty } as ProductContextValue);

  return <ProductContext.Provider value={api}>{children}</ProductContext.Provider>;
});
