import { AdapterContext } from '@realtime-sdk/adapters/types';
import { BaseButton, BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import { AnyRecord, EmptyObject, Utils } from '@voiceflow/common';
import createAdapter, { createSimpleAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';

export * from './noMatch';
export * from './noReply';
export * from './port';
export * from './portV2';
export * from './prompt';

export interface BlockAdapterOptions {
  context: AdapterContext;
}

export interface FromDBBlockAdapterOptions
  extends BlockAdapterOptions,
    Pick<BaseModels.BaseStep<Record<string, unknown>>['data'], 'ports' | 'portsV2'> {}

export const createBlockAdapter = <
  DBSchema extends AnyRecord,
  AppSchema extends AnyRecord,
  FromDBOptions extends object = EmptyObject,
  ToDBOptions extends object = EmptyObject
>(
  fromDB: (dbData: DBSchema, options: FromDBBlockAdapterOptions & FromDBOptions) => AppSchema,
  toDB: (appData: AppSchema, options: BlockAdapterOptions & ToDBOptions) => DBSchema
) => createSimpleAdapter<DBSchema, AppSchema, [FromDBBlockAdapterOptions & FromDBOptions], [BlockAdapterOptions & ToDBOptions]>(fromDB, toDB);

export const chipsToIntentButtons = (chips?: Nullable<BaseButton.Chip[]>): Nullable<BaseButton.IntentButton[]> =>
  chips?.map(({ label: name }) => ({ name, type: BaseButton.ButtonType.INTENT, payload: { intentID: null } })) ?? null;

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
