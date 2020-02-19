import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';

export const CornerActionButton = styled(SvgIcon)`
  ${transition('color')}
  position: absolute;
  padding: 5px;
  margin: -5px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #8da2b5;

  :hover {
    color: #8da2b5;
  }
`;

export const ReturnButton = styled.div`
  color: #8da2b5;
  display: inline-block;
  cursor: pointer;
`;

export const UploadingSpinner = styled(LoadCircle)`
  position: absolute;
  left: 24px;
`;

export const StatusIcon = styled(SvgIcon)`
  position: absolute;
  left: 32px;
`;
