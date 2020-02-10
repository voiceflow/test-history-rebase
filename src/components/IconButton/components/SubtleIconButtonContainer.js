import { buttonContainerStyles } from '@/components/Button/components/ButtonContainer';
import { SvgIconContainer } from '@/components/SvgIcon';
import { styled } from '@/hocs';

const SubtleIconButtonContainer = styled.button`
  ${buttonContainerStyles}

  & ${SvgIconContainer} {
    color: #8da2b5;
    max-width: 16px;
  }

  &:hover ${SvgIconContainer} {
    color: #2e3852;
  }
`;

export default SubtleIconButtonContainer;
