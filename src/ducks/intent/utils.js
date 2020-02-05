import _ from 'lodash';

export const getUniqSlots = (inputs) => [...new Set(_.flatMap(inputs.map(({ slots }) => slots || [])))];

export const newSlotsCreator = (id) => ({
  id,
  dialog: { prompt: [{ text: '', slots: [] }], utterances: [], confirm: [{ text: '', slots: [] }], confirmEnabled: false },
  required: false,
});

export const intentProcessor = ({ inputs = [], ...intent }) => {
  let slots = intent.slots;

  if (!_.isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce((obj, id) => Object.assign(obj, { [id]: newSlotsCreator(id) }), {});

    slots = { byKey, allKeys };
  }

  return { ...intent, slots, inputs };
};
