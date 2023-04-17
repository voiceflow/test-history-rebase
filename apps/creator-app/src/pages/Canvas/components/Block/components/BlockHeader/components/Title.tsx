import { styled } from '@/hocs/styled';

import { BlockHeaderProps, headerInputStyles } from './HeaderInput';

const Title = styled.div<BlockHeaderProps & { disabled?: boolean }>`
  ${headerInputStyles};

  max-width: 100%;
  color: ${({ palette }) => palette[700]};
  display: inline-block;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    background: ${({ palette }) => palette[200]};
  }
`;

export default Title;
