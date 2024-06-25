import { styled } from '@ui/styles';

import { PreviewColors } from '../constants';

const PreviewPopover = styled.div`
  background-color: ${PreviewColors.GREY_BACKGROUND_COLOR};
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:
    rgb(17 49 96 / 8%) 0px 8px 16px 0px,
    rgb(17 49 96 / 6%) 0px 0px 0px 1px;
`;

export default PreviewPopover;
