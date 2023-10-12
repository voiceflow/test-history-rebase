import type { AnyResponseVariantWithData } from '../response-variant/response-variant-with-data.interface';
import type { ResponseDiscriminator } from './response-discriminator.interface';

export interface ResponseDiscriminatorWithVariants extends ResponseDiscriminator {
  variants: AnyResponseVariantWithData[];
}
