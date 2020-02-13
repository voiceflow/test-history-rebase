import { buttonContainerStyles } from '@/components/Button/components/ButtonContainer';
import * as SvgIcon from '@/components/SvgIcon';
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
