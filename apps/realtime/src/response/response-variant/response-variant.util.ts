import { CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

import { ResponseJSONVariantCreateData, ResponsePromptVariantCreateData, ResponseTextVariantCreateData } from './response-variant.interface';

export const emptyResponseVariantFactory = (data: {
  type: ResponseVariantType;
  assistantID: string;
  environmentID: string;
  discriminatorID: string;
}) =>
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
    .with(
      { type: ResponseVariantType.JSON },
      (payload): ResponseJSONVariantCreateData => ({
        ...payload,
        json: [''],
        conditionID: null,
        attachmentOrder: [],
      })
    )
    .with(
      { type: ResponseVariantType.PROMPT },
      (payload): ResponsePromptVariantCreateData => ({
        ...payload,
        turns: 1,
        context: ResponseContext.PROMPT,
        promptID: null,
        conditionID: null,
        attachmentOrder: [],
      })
    )
    .exhaustive();
