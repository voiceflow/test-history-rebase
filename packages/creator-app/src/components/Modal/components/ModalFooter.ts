import { backgrounds, BoxFlex, colors, ThemeColor } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

const ModalFooter = styled(BoxFlex)`
  width: 100%;
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-end'};
  padding: ${units(3)}px ${units(4)}px;
  background: ${backgrounds('gray')};
  border-top: 1px solid ${colors(ThemeColor.SEPARATOR_SECONDARY)};
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export default ModalFooter;
