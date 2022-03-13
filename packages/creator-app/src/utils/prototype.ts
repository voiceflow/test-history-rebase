// eslint-disable-next-line import/prefer-default-export
export const getPrototypeSessionID = (versionID: string | null, prototypeID: string | null): string => `${versionID}.${prototypeID}`;
