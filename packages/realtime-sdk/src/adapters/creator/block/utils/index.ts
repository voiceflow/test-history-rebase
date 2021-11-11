import { Button, Node as BaseNode, Nullable } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import createAdapter, { createSimpleAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';

export * from './noMatch';
export * from './port';
export * from './prompt';

export const createBlockAdapter = createSimpleAdapter;

export const chipsToIntentButtons = (chips?: Nullable<Button.Chip[]>): Nullable<Button.IntentButton[]> =>
  chips?.map(({ label: name }) => ({ name, type: Button.ButtonType.INTENT, payload: { intentID: null } })) ?? null;

export const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ goTo = null, intent, action = BaseNode.Interaction.ChoiceAction.PATH, mappings = [] }) => ({
    id: Utils.id.cuid.slug(),
    goTo,
    intent,
    action,
    mappings,
  }),
  ({ goTo, intent, action, mappings }) => ({
    goTo: goTo ?? undefined,
    intent: intent ?? '',
    action,
    mappings,
  })
);
