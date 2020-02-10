import IconButton from '@/components/IconButton';
import { css, styled } from '@/hocs';

const AddStepButtonIcon = styled(IconButton)`
  opacity: 1;
  background: #fff;

  ${({ theme }) => css`
    height: ${theme.unit * 4}px;
    width: ${theme.unit * 4}px;
  `}
`;

export default AddStepButtonIcon;
