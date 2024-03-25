import type { ToJSON, ToObject } from '@/types';

import type { ProductUpdateEntity } from './product-update.entity';

export type ProductUpdateObject = ToObject<ProductUpdateEntity>;
export type ProductUpdateJSON = ToJSON<ProductUpdateObject>;
