import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface LegendItemProps {
  color: string;
  gradient: string;
}

const LegendItem = styled(FlexApart)<LegendItemProps>`
  position: relative;
  font-size: 15px;
  margin-bottom: 16px;
  padding-left: 24px;
  color: #132144;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 12px;
    height: 12px;
    border: ${({ color }) => color} solid 1px;
    border-radius: 50%;
    background-image: ${({ gradient }) => gradient};
    content: '';
    transform: translateY(-50%);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export default LegendItem;
