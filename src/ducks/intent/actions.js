import _ from 'lodash';

import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const { add, addMany, remove: removeIntent, replace, reorder: reorderIntents } = createCRUDActionCreators(STATE_KEY);

export { removeIntent, reorderIntents };

const getUniqSlots = (inputs) => [...new Set(_.flatMap(inputs.map(({ slots }) => slots || [])))];

const newSlotsCreator = (id) => ({
  id,
  dialog: { prompt: [{ text: '', slots: [] }], utterances: [], confirm: [{ text: '', slots: [] }], confirmEnabled: false },
  required: false,
});

const intentProcessor = ({ inputs = [], ...intent }) => {
  let slots = intent.slots;

  if (!_.isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce((obj, id) => Object.assign(obj, { [id]: newSlotsCreator(id) }), {});

    slots = { byKey, allKeys };
  }

  return { ...intent, slots, inputs };
};

export const addIntent = (id, data) => add(id, intentProcessor(data));

export const addIntents = (values) => addMany(values.map(intentProcessor));

export const replaceIntents = (values, meta) => replace(values.map(intentProcessor), meta);
