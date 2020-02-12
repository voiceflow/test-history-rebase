import Button from '@/components/Button';
import { Icon, Label } from '@/components/Button/components/PrimaryButton/components';
import * as SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';
import { Spin } from '@/styles/animations';

const UploadButton = styled(Button).attrs({ speed: 2000, icon: 'publishSpin' })`
  ${({ isUploading }) =>
    isUploading &&
    css`
      background: linear-gradient(-180deg, #5d9df588 0%, #176ce088 68%);
    `}

  ${Icon} {
    background: linear-gradient(-180deg, #427fcf 0%, #125bc1 68%);
    ${SvgIcon.Container} {
      display: block;
      opacity: 1;
      ${({ isUploading }) => isUploading && Spin}
    }
  }

  ${Label} {
    width: 156px;
    padding-right: 0;
    text-align: left;
  }
`;

export default UploadButton;
