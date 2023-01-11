import { ABBREVIATIONS, SCALE_INCREMENTS, SCALE_MINIMUM } from './constants';
import { AreaChartDatum, DatumFormatter } from './types';

const getScale = (value: number, scale = SCALE_MINIMUM): number => {
  const nextScale = SCALE_INCREMENTS.map((increment) => increment * scale).find((scale) => scale > value);

  return nextScale ?? getScale(value, scale * 10);
};

export const getMaxY = (data: AreaChartDatum[]) => {
  const actualMaxY = Math.max(...data.map(({ y }) => y));
  const scaleY = getScale(actualMaxY);

  return Math.ceil(actualMaxY / scaleY) * scaleY;
};

export const abbreviateNumber: DatumFormatter = (value) => {
  const numericValue = Number(value);
  let minAbbreviation: [number, string] | undefined;

  // eslint-disable-next-line no-restricted-syntax
  for (const abbreviation of ABBREVIATIONS) {
    if (abbreviation[0] <= numericValue) {
      minAbbreviation = abbreviation;
    } else {
      break;
    }
  }

  if (!minAbbreviation) return numericValue.toExponential(1);

  const [minimum, suffix] = minAbbreviation;
  if (!suffix) return String(numericValue);

  const abbreviated = numericValue / minimum;
  return `${abbreviated % 1 ? abbreviated.toFixed(1) : abbreviated}${suffix}`;
};
