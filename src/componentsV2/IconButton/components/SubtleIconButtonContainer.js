import * as SvgIcon from '@/components/SvgIcon';
import { buttonContainerStyles } from '@/componentsV2/Button/components/ButtonContainer';
import { styled } from '@/hocs';

const SubtleIconButtonContainer = styled.button`
  ${buttonContainerStyles}

  & ${SvgIcon.Container} {
    color: #8da2b5;
    max-width: 16px;
  }

  &:hover ${SvgIcon.Container} {
    color: #2e3852;
  }
`;

export default SubtleIconButtonContainer;
