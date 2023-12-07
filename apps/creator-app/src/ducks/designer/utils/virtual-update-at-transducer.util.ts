import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';
import { ActionCreator } from 'typescript-fsa';

import type { STATE_KEY as ATTACHMENT_STATE_KEY } from '@/ducks/designer/attachment/attachment.state';
import type { DesignerState } from '@/ducks/designer/designer.state';
import type { STATE_KEY as ENTITY_STATE_KEY } from '@/ducks/designer/entity/entity.state';
import type { STATE_KEY as EVENT_STATE_KEY } from '@/ducks/designer/event/event.state';
import type { STATE_KEY as FUNCTION_STATE_KEY } from '@/ducks/designer/function/function.state';
import type { STATE_KEY as INTENT_STATE_KEY } from '@/ducks/designer/intent/intent.state';
import type { STATE_KEY as PERSONA_STATE_KEY } from '@/ducks/designer/persona/persona.state';
import type { STATE_KEY as RESPONSE_STATE_KEY } from '@/ducks/designer/response/response.state';
import type { STATE_KEY as STORY_STATE_KEY } from '@/ducks/designer/story/story.state';
import { Transducer } from '@/ducks/transducers/types';
import type { State } from '@/store/types';

import { STATE_KEY as DESIGNER_STATE_KEY } from '../designer.state';
import { extractUpdatedByIDFromMeta } from './action.util';

type AnyRootResourceStateKey =
  | typeof EVENT_STATE_KEY
  | typeof STORY_STATE_KEY
  | typeof ENTITY_STATE_KEY
  | typeof INTENT_STATE_KEY
  | typeof PERSONA_STATE_KEY
  | typeof FUNCTION_STATE_KEY
  | typeof RESPONSE_STATE_KEY
  | typeof ATTACHMENT_STATE_KEY;
type SupportedDesignerState = Pick<DesignerState, AnyRootResourceStateKey>;
type AnyReferenceResourceStateKey<T extends SupportedDesignerState[AnyRootResourceStateKey]> = {
  [Key in keyof T]: T[Key] extends Normal.Normalized<any> ? Key : never;
}[keyof T];

type ReferenceResource<
  RootResourceStateKey extends AnyRootResourceStateKey,
  ReferenceResourceStateKey extends AnyReferenceResourceStateKey<SupportedDesignerState[RootResourceStateKey]>
> = Normal.NormalizedValue<SupportedDesignerState[RootResourceStateKey][ReferenceResourceStateKey]> & { id: string };

interface ReferenceVirtualUpdateAtTransducerFactoryOptions<
  RootResourceStateKey extends AnyRootResourceStateKey,
  ReferenceResourceStateKey extends AnyReferenceResourceStateKey<SupportedDesignerState[RootResourceStateKey]>,
  AddOneAction extends Actions.CRUD.AddOneRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
  AddManyAction extends Actions.CRUD.AddManyRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
  ReplaceAction extends Actions.CRUD.ReplaceRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
  PatchOneAction extends Actions.CRUD.PatchOneRequest<any>,
  PatchManyAction extends Actions.CRUD.PatchManyRequest<any>,
  DeleteOneAction extends Actions.CRUD.DeleteOneRequest,
  UpdateOneAction extends Actions.CRUD.UpdateOneRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
  DeleteManyAction extends Actions.CRUD.DeleteManyRequest,
  UpdateManyAction extends Actions.CRUD.UpdateManyRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>
> {
  actions: {
    AddOne: ActionCreator<AddOneAction>;
    AddMany: ActionCreator<AddManyAction>;
    Replace: ActionCreator<ReplaceAction>;
    PatchOne: ActionCreator<PatchOneAction>;
    PatchMany: ActionCreator<PatchManyAction>;
    DeleteOne: ActionCreator<DeleteOneAction>;
    UpdateOne?: ActionCreator<UpdateOneAction>;
    DeleteMany: ActionCreator<DeleteManyAction>;
    UpdateMany?: ActionCreator<UpdateManyAction>;
  };
  getRootID: (
    reference: ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>,
    rootResourceState: SupportedDesignerState[RootResourceStateKey],
    state: State
  ) => string;
  rootStateKey: RootResourceStateKey;
  referenceStateKey: ReferenceResourceStateKey;
}

interface IReferenceVirtualUpdateAtTransducerFactory {
  <
    RootResourceStateKey extends AnyRootResourceStateKey,
    ReferenceResourceStateKey extends AnyReferenceResourceStateKey<SupportedDesignerState[RootResourceStateKey]>,
    AddOneAction extends Actions.CRUD.AddOneRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
    AddManyAction extends Actions.CRUD.AddManyRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
    ReplaceAction extends Actions.CRUD.ReplaceRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
    PatchOneAction extends Actions.CRUD.PatchOneRequest<any>,
    PatchManyAction extends Actions.CRUD.PatchManyRequest<any>,
    DeleteOneAction extends Actions.CRUD.DeleteOneRequest,
    UpdateOneAction extends Actions.CRUD.UpdateOneRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>,
    DeleteManyAction extends Actions.CRUD.DeleteManyRequest,
    UpdateManyAction extends Actions.CRUD.UpdateManyRequest<ReferenceResource<RootResourceStateKey, ReferenceResourceStateKey>>
  >(
    options: ReferenceVirtualUpdateAtTransducerFactoryOptions<
      RootResourceStateKey,
      ReferenceResourceStateKey,
      AddOneAction,
      AddManyAction,
      ReplaceAction,
      PatchOneAction,
      PatchManyAction,
      DeleteOneAction,
      UpdateOneAction,
      DeleteManyAction,
      UpdateManyAction
    >
  ): { actions: Set<string>; transducer: Transducer<State> };
}

export const referenceVirtualUpdateAtTransducerFactory: IReferenceVirtualUpdateAtTransducerFactory = ({
  actions,
  getRootID,
  rootStateKey,
  referenceStateKey,
}) => {
  const actionTypes = new Set([
    actions.AddOne.type,
    actions.AddMany.type,
    actions.Replace.type,
    actions.PatchOne.type,
    actions.PatchMany.type,
    actions.DeleteOne.type,
    actions.DeleteMany.type,
    ...(actions.UpdateOne ? [actions.UpdateOne.type] : []),
    ...(actions.UpdateMany ? [actions.UpdateMany.type] : []),
  ]);

  return {
    actions: actionTypes,
    transducer: (rootReducer) => (state, action) => {
      if (!state) return rootReducer(state, action);

      const setUpdatedAt = (nextState: State, referenceIDs: string[]): State => {
        const rootState = nextState[DESIGNER_STATE_KEY][rootStateKey];

        if (!rootState) return nextState;

        const referenceState = rootState[referenceStateKey] as Normal.Normalized<any> | undefined;

        if (!referenceState) return nextState;

        const references = Normal.getMany(referenceState, referenceIDs);

        if (!references.length) return nextState;

        const updatedAt = new Date().toJSON();
        const updatedByID = extractUpdatedByIDFromMeta(action.meta);

        return {
          ...nextState,
          [DESIGNER_STATE_KEY]: {
            ...nextState[DESIGNER_STATE_KEY],
            [rootStateKey]: Normal.patchMany(
              rootState,
              references.map((reference) => ({
                key: getRootID(reference, rootState, nextState),
                value: { updatedAt, ...(updatedByID !== null && { updatedByID }) } as any,
              }))
            ),
          },
        };
      };

      if (actions.AddOne.match(action)) return setUpdatedAt(rootReducer(state, action), [action.payload.data.id]);
      if (actions.AddMany.match(action))
        return setUpdatedAt(
          rootReducer(state, action),
          action.payload.data.map((data) => data.id)
        );
      if (actions.PatchOne.match(action)) return setUpdatedAt(rootReducer(state, action), [action.payload.id]);
      if (actions.PatchMany.match(action)) return setUpdatedAt(rootReducer(state, action), action.payload.ids);
      if (actions.DeleteOne.match(action)) return rootReducer(setUpdatedAt(state, [action.payload.id]), action);
      if (actions.DeleteMany.match(action)) return rootReducer(setUpdatedAt(state, action.payload.ids), action);
      if (actions.UpdateOne?.match(action)) return setUpdatedAt(rootReducer(state, action), [action.payload.update.id]);
      if (actions.UpdateMany?.match(action))
        return setUpdatedAt(
          rootReducer(state, action),
          action.payload.update.map((data) => data.id)
        );
      if (actions.Replace.match(action)) {
        const nextState = rootReducer(state, action);
        const referenceIDs = action.payload.data.map((data) => data.id);

        let rootState = nextState[DESIGNER_STATE_KEY][rootStateKey];

        if (!rootState) return nextState;

        const referenceState = rootState[referenceStateKey] as Normal.Normalized<any> | undefined;

        if (!referenceState) return nextState;

        const references = Normal.getMany(referenceState, referenceIDs);

        if (!references.length) return nextState;

        return references.reduce((acc, reference) => {
          rootState = acc[DESIGNER_STATE_KEY][rootStateKey];

          if (!rootState) return acc;

          const rootResourceID = getRootID(reference, rootState, acc);
          const rootResource = Normal.get(rootState, rootResourceID);

          if (!rootResource) return acc;

          if (!reference.updatedAt || new Date(reference.updatedAt) <= new Date(rootResource.updatedAt)) return acc;

          return {
            ...acc,
            [DESIGNER_STATE_KEY]: {
              ...acc[DESIGNER_STATE_KEY],
              [rootStateKey]: Normal.patchOne(rootState, rootResourceID, {
                updatedAt: reference.updatedAt,
                ...(reference.updatedByID && { updatedByID: reference.updatedByID }),
              } as any),
            },
          };
        }, nextState);
      }

      return rootReducer(state, action);
    },
  };
};

export const virtualUpdateAtTransducerFactory = (
  ...references: Array<{ actions: Set<string>; transducer: Transducer<State> }>
): Transducer<State> => {
  const referenceTransducerMap = Object.fromEntries(
    references.flatMap(({ actions, transducer }) => Array.from(actions).map((type) => [type, transducer] as const))
  );

  const actionTypes = new Set(Object.keys(referenceTransducerMap));

  return (rootReducer) => (state, action) => {
    if (!state || !actionTypes.has(action.type)) return rootReducer(state, action);

    const referenceTransducer = referenceTransducerMap[action.type];

    return referenceTransducer ? referenceTransducer(rootReducer)(state, action) : rootReducer(state, action);
  };
};
