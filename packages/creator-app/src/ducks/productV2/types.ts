/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { Product } from '@/models';

export interface ProductState extends CRUDState<Product> {}
