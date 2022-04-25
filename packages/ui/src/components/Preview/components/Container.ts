import { styled } from '@ui/styles';

import { PreviewColors } from '../constants';

const PreviewContainer = styled.div`
  border-radius: 8px;
  background-color: ${PreviewColors.GREY_BACKGROUND_COLOR};
  width: 288px;
  max-height: 306px;
`;

export default PreviewContainer;
