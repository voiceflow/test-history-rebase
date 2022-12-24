import { colors, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const SubjectText = styled.div`
  color: ${colors(ThemeColor.SECONDARY)};

  ::first-letter {
    text-transform: capitalize;
  }

  strong {
    color: ${colors(ThemeColor.RED)};
  }

  em {
    color: ${colors(ThemeColor.PRIMARY)};
    font-weight: 600;
    font-style: normal;
  }
`;
