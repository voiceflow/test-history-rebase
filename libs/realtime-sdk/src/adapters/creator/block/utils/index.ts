import type { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import { BaseButton } from '@voiceflow/base-types';
import type { AnyRecord, EmptyObject } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter, createSimpleAdapter } from 'bidirectional-adapter';

import type { AdapterContext } from '@/adapters/types';

import type { NodeData } from '../../../../models';

export * from './noMatch';
export * from './noReply';
export * from './port';
export * from './portV2';

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
  ToDBOptions extends object = EmptyObject,
>(
  fromDB: (dbData: DBSchema, options: FromDBBlockAdapterOptions & FromDBOptions) => AppSchema,
  toDB: (appData: AppSchema, options: BlockAdapterOptions & ToDBOptions) => DBSchema
) =>
  createSimpleAdapter<
    DBSchema,
    AppSchema,
    [FromDBBlockAdapterOptions & FromDBOptions],
    [BlockAdapterOptions & ToDBOptions]
  >(fromDB, toDB);

export const chipsToIntentButtons = (chips?: Nullable<BaseButton.Chip[]>): Nullable<BaseButton.IntentButton[]> =>
  chips?.map(({ label: name }) => ({ name, type: BaseButton.ButtonType.INTENT, payload: { intentID: null } })) ?? null;

export const choiceAdapter = createMultiAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({
    id: Utils.id.cuid.slug(),
    intent,
    mappings,
  }),
  ({ intent, mappings }) => ({
    intent: intent ?? '',
    mappings,
  })
);
