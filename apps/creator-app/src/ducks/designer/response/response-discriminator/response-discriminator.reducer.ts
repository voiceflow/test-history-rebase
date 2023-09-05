import type { ResponseDiscriminator } from '@voiceflow/sdk-logux-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import type { Draft } from 'immer';
import { appendMany, appendOne, getOne, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';

import { createRootReducer } from '@/ducks/utils/reducer';

import { INITIAL_STATE, type ResponseDiscriminatorState } from './response-discriminator.state';

const addToIDByResponseIDLanguageChannel = (
  state: Draft<ResponseDiscriminatorState>,
  { responseID, language, channel, id }: ResponseDiscriminator
) => {
  state.idByLanguageChannelResponseID[language] ??= {};
  state.idByLanguageChannelResponseID[language]![channel] ??= {};
  state.idByLanguageChannelResponseID[language]![channel]![responseID] = id;
};

const removeFromIDByResponseIDLanguageChannel = (state: Draft<ResponseDiscriminatorState>, discriminator: ResponseDiscriminator | null) => {
  if (!discriminator) return;

  const { responseID, language, channel } = discriminator;

  delete state.idByLanguageChannelResponseID[language]?.[channel]?.[responseID];
};

export const responseDiscriminatorReducer = createRootReducer<ResponseDiscriminatorState>(INITIAL_STATE)
  .case(Actions.ResponseDiscriminator.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.ResponseDiscriminator.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .immerCase(Actions.ResponseDiscriminator.AddOne, (state, { data }) => {
    addToIDByResponseIDLanguageChannel(state, data);

    Object.assign(state, appendOne(state, data.id, data));
  })
  .immerCase(Actions.ResponseDiscriminator.AddMany, (state, { data }) => {
    data.forEach((item) => addToIDByResponseIDLanguageChannel(state, item));

    Object.assign(state, appendMany(state, data));
  })
  .immerCase(Actions.ResponseDiscriminator.DeleteOne, (state, { id }) => {
    removeFromIDByResponseIDLanguageChannel(state, getOne(state, id));

    Object.assign(state, removeOne(state, id));
  })
  .immerCase(Actions.ResponseDiscriminator.DeleteMany, (state, { ids }) => {
    ids.forEach((id) => removeFromIDByResponseIDLanguageChannel(state, getOne(state, id)));

    Object.assign(state, removeMany(state, ids));
  })
  .immerCase(Actions.ResponseDiscriminator.Replace, (state, { data }) => {
    state.idByLanguageChannelResponseID = {};

    data.forEach((discriminator) => addToIDByResponseIDLanguageChannel(state, discriminator));

    Object.assign(state, normalize(data));
  });
