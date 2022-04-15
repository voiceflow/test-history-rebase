export const getPrototypeSessionID = (versionID: string | null, prototypeID: string | null): string => `${versionID}.${prototypeID}`;
