import { styled } from '@ui/styles';

import { PreviewColors } from '../constants';

const PreviewPopover = styled.div`
  background-color: ${PreviewColors.GREY_BACKGROUND_COLOR};
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PreviewPopover;
