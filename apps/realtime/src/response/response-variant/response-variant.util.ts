import { CardLayout, ResponseVariantType } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

import { ResponseTextVariantCreateData } from './response-variant.interface';

export const emptyResponseVariantFactory = (data: { type: ResponseVariantType; discriminatorID: string }) =>
  match(data)
    .with(
      { type: ResponseVariantType.TEXT },
      (payload): ResponseTextVariantCreateData => ({
        ...payload,
        text: [''],
        speed: null,
        cardLayout: CardLayout.CAROUSEL,
        conditionID: null,
        attachmentOrder: [],
      })
    )
    .with({ type: ResponseVariantType.PROMPT }, () => {
      throw new Error('Prompt variant not supported');
    })
    .exhaustive();
