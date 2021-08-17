import { Node } from '@voiceflow/base-types';

// eslint-disable-next-line import/prefer-default-export
export const getNoMatchSectionLabel = (type: Node.Utils.NoMatchType | null) => {
  switch (type) {
    case Node.Utils.NoMatchType.REPROMPT:
      return 'Reprompt';
    case Node.Utils.NoMatchType.PATH:
      return 'Path';
    case Node.Utils.NoMatchType.BOTH:
      return 'Reprompt + Path';
    default:
      return '';
  }
};
