import { NoMatchType } from '@voiceflow/general-types';

// eslint-disable-next-line import/prefer-default-export
export const getNoMatchSectionLabel = (type: NoMatchType | null) => {
  switch (type) {
    case NoMatchType.REPROMPT:
      return 'Reprompt';
    case NoMatchType.PATH:
      return 'Path';
    case NoMatchType.BOTH:
      return 'Reprompt + Path';
    default:
      return '';
  }
};
