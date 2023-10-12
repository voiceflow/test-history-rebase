import type { Response } from './response.interface';
import type { ResponseDiscriminatorWithVariants } from './response-discriminator/response-discriminator-with-variants.interface';

export interface ResponseWithResponses extends Response {
  responses: ResponseDiscriminatorWithVariants[];
}
