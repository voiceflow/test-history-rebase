import { styled, withBlockVariantStyle } from '@/hocs';

import { BlockHeaderProps, headerInputStyles } from './HeaderInput';

const Title = styled.div<BlockHeaderProps & { disabled?: boolean }>`
  ${headerInputStyles};

  max-width: 100%;
  color: ${withBlockVariantStyle((variant) => variant.color)};
  display: inline-block;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    background: ${({ theme, variant }) => theme.components.block.variants[variant].editTitleColor};
  }
`;

export default Title;
