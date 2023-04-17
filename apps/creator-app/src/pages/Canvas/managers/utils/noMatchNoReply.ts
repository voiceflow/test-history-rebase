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
