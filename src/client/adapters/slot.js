import cuid from 'cuid';

import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@/constants';

import { createAdapter } from './utils';

const slotAdapter = createAdapter(
  ({ key, name, inputs, color, type, required }) => ({
    id: key,
    name,
    type: (type && (type.value === LEGACY_CUSTOM_SLOT_TYPE ? CUSTOM_SLOT_TYPE : type.value)) || null,
    color,
    inputs: inputs.map((input) => {
      const synonyms = input.split(',');
      return {
        id: cuid.slug(),
        value: synonyms[0],
        synonyms: synonyms.slice(1).join(','),
      };
    }),
    required,
  }),
  ({ id, name, inputs, color, type, required }) => ({
    key: id,
    name,
    type: { value: type || CUSTOM_SLOT_TYPE },
    color,
    inputs: inputs.map(({ value, synonyms }) => (synonyms ? `${value},${synonyms}` : value)),
    required,
  })
);

slotAdapter.spreadSynonyms = (slot) => {
  return {
    ...slot,
    inputs: slot.inputs.reduce((acc, input) => {
      return [
        ...acc,
        ...input
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      ];
    }, []),
  };
};

export default slotAdapter;
