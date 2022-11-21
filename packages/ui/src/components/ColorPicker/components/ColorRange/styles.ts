import IconButton from '@ui/components/IconButton';
import { styled } from '@ui/styles';

import { BoxFlex } from '../../../Box';

export const RangeContainer = styled(BoxFlex)`
  width: 204px;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledIconButton = styled(IconButton)`
  margin-left: 5px;
  margin-right: -5px;
`;
