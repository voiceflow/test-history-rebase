import { Transform } from './types';

const mapInputToVariants = (str: string) => {
  const values = str.split(',').map((s) => s.trim());

  return {
    value: values[0],
    synonyms: values.slice(1),
  };
};

// create cms v3 entities from v2 version
const migrateToV4_07: Transform = ({ version, entities }) => {
  version.platformData.slots.forEach((slot) => {
    const entityIndex = entities.findIndex((entity) => entity.name === slot.name);

    if (entityIndex >= 0) {
      const entity = entities[entityIndex];
      const variantValues = new Set(entity.variants.map((variant) => variant.value));

      entity.color = slot.color || entity.color;

      // add new variants
      entity.variants.push(...slot.inputs.filter((input) => !variantValues.has(input)).map(mapInputToVariants));

      // edit existing variants
      slot.inputs.forEach((input) => {
        const variantIndex = entity.variants.findIndex((variant) => variant.value === input);

        if (variantIndex >= 0) {
          entity.variants[variantIndex].synonyms = input
            .split(',')
            .map((s) => s.trim())
            .slice(1);
        }
      });

      return;
    }

    entities.push({
      classifier: null,
      color: slot.color || '',
      description: '',
      folderID: null,
      isArray: false,
      name: slot.name,
      variants: slot.inputs.map(mapInputToVariants),
    });
  });
};

export default migrateToV4_07;
