import { z } from 'zod';

import { Markup } from '@/common/dtos/markup.dto';

import { ListenType } from './listen-type.enum';

export const BaseListenData = z.object({
  noReply: z
    .object({
      limit: z.number(),
      repromptID: z.string().uuid().nullable(),
      showPort: z.boolean(),
    })
    .nullable(),

  listenForTriggers: z.boolean(),
});

export type BaseListenData = z.infer<typeof BaseListenData>;

const RempromptRule = z.object({
  id: z.string(),
  value: Markup,
});

const ExitScenario = z.object({
  id: z.string(),
  value: Markup,
});

export const AutomaticReprompt = z.object({
  automaticReprompt: z
    .object({
      personaOverrideID: z.string().uuid().nullable(),
      rules: RempromptRule.array(),
      exitScenarios: ExitScenario.array(),
      showExitPort: z.boolean(),
    })
    .nullable(),
});

export type AutomaticReprompt = z.infer<typeof AutomaticReprompt>;

const NoMatch = z.object({
  noMatch: z
    .object({
      /**
       * ID of a Response used as a reprompt if no option was matched
       */
      repromptID: z.string().uuid().nullable(),
      showPort: z.boolean(),
    })
    .nullable(),
});

export type NoMatch = z.infer<typeof NoMatch>;

/* listen for button */

export const ButtonListenItem = z.object({
  id: z.string(),
  label: Markup,
});

export type ButtonListenItem = z.infer<typeof ButtonListenItem>;

export const ButtonListenData = BaseListenData.merge(AutomaticReprompt)
  .merge(NoMatch)
  .extend({
    type: z.literal(ListenType.BUTTON),
    buttons: ButtonListenItem.array(),
  });

export type ButtonListenData = z.infer<typeof ButtonListenData>;

/* listen for intent */

export const IntentListenItem = z.object({
  id: z.string(),
  intentID: z.string().uuid().nullable(),
  button: Markup.nullable(),
});

export type IntentListenItem = z.infer<typeof IntentListenItem>;

export const IntentListenData = BaseListenData.merge(AutomaticReprompt)
  .merge(NoMatch)
  .extend({
    type: z.literal(ListenType.INTENT),
    intents: IntentListenItem.array(),
  });

export type IntentListenData = z.infer<typeof IntentListenData>;

/* listen for entity */

export const EntityListenItem = z.object({
  id: z.string(),
  entityID: z.string().uuid().nullable(),
  variableID: z.string().uuid().nullable(),
  /**
   * ID of a Response used as a reprompt if automaticReprompt is false
   */
  repromptID: z.string().uuid().nullable(),
  isRequired: z.boolean(),
  inlineInput: z.object({ placeholder: Markup }).nullable(),
});

export type EntityListenItem = z.infer<typeof EntityListenItem>;

export const EntityListenData = BaseListenData.merge(AutomaticReprompt)
  .merge(NoMatch)
  .extend({
    type: z.literal(ListenType.ENTITY),
    entities: EntityListenItem.array(),
  });

export type EntityListenData = z.infer<typeof EntityListenData>;

/* listen for raw */

export const RawListenData = BaseListenData.extend({
  type: z.literal(ListenType.RAW),
  variableID: z.string().uuid(),
});

export type RawListenData = z.infer<typeof RawListenData>;
