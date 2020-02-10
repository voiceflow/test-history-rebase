import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

import { horizontalDividerStyles } from './HorizontalDivider';

const LabeledHorizontalDivider = styled(Flex)`
  margin: ${units()}px 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #8da2b5;
  white-space: nowrap;

  &::before,
  &::after {
    ${horizontalDividerStyles}

    display: block;
    content: '';
  }

  &::before {
    margin-right: ${units()}px;
  }

  &::after {
    margin-left: ${units()}px;
  }
`;

export default LabeledHorizontalDivider;
