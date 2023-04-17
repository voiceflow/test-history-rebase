import SvgIcon from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';

export const ErrorMessage = styled.div`
  position: absolute;
  margin-top: 5px;
  color: #e91e63;
  font-size: 13px;
`;

export const BackArrow = styled(SvgIcon).attrs({ color: '#8da2b5' })`
  ${transition('color', 'transform')}
  cursor: pointer;

  :hover {
    transform: translateX(-4px);
  }
`;

export const LinkUploadInputContainer = styled.div`
  position: relative;
  width: 100%;
`;
