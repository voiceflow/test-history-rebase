import { rgba } from 'polished';

import { css, styled, transition } from '@/hocs';

const PlatformFeatureBubble = styled.div<{ color: string }>`
  ${transition('border-color')};

  display: inline-block;
  padding: 4px 8px;
  font-weight: 600;
  letter-spacing: 0.7px;
  background-color: #fff;
  border: solid 1px transparent;
  border-radius: 17px;

  font-size: 11px;
  text-transform: uppercase;
  margin-right: 6px;

  ${({ color }) => css`
    color: ${color};
    border-color: ${rgba(color, 0.2)} !important;

    :hover {
      border-color: ${rgba(color, 0.4)} !important;
    }
  `}
`;

export default PlatformFeatureBubble;
