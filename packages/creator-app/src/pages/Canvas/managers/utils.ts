export const getNoMatchNoReplySectionLabel = <E extends { REPROMPT: string; PATH: string }>(Enum: E, types: string[]): string => {
  const names = [];

  if (types.includes(Enum.REPROMPT)) {
    names.push('Reprompt');
  }

  if (types.includes(Enum.PATH)) {
    names.push('Path');
  }

  return names.join(' + ');
};

export const getNoMatchNoReplySectionLabelByType = <E extends { REPROMPT: string; PATH: string; BOTH: string }>(
  Enum: E,
  type: null | string
): string => {
  switch (type) {
    case Enum.PATH:
      return 'Path';
    case Enum.REPROMPT:
      return 'Reprompt';
    case Enum.BOTH:
      return 'Reprompt + Path';
    default:
      return '';
  }
};
