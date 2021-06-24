import { SvgIconContainer } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Select = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? '#5d9df5' : '#62778c')};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: #5d9df5;
  }

  ${SvgIconContainer} {
    display: inline-block;
  }
`;

export default Select;
