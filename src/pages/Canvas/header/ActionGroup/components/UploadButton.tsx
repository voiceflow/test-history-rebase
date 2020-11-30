import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import { Icon, Label } from '@/components/Button/components/PrimaryButton/components';
import * as SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { css, styled } from '@/hocs';
import { usePermission } from '@/hooks';
import { Spin } from '@/styles/animations';
import { Identifier } from '@/styles/constants';

export type UploadButtonProps = {
  isVendors?: boolean;
  isUploading?: boolean;
};

const UploadButton = styled(Button).attrs({ speed: 2000 })<UploadButtonProps>`
  ${({ isVendors }) =>
    isVendors &&
    css`
      min-width: 135px;
    `}

  ${({ isUploading }) =>
    isUploading &&
    css`
      background: linear-gradient(-180deg, #5d9df588 0%, #176ce088 68%);
      box-shadow: none;
    `}

  ${Icon} {
    background: linear-gradient(-180deg, #427fcf 0%, #125bc1 68%);
    box-shadow: none;

    ${SvgIcon.Container} {
      display: block;
      opacity: 1;
      ${({ isUploading }) => isUploading && Spin}
    }
  }

  ${Label} {
    padding-right: 20px;
    text-align: left;
  }
`;

type UploadButtonContainerProps = {
  onClick: () => void;
  isActive: boolean;
  label: string;
  tooltip?: string;
};

const UploadButtonContainer: React.FC<UploadButtonContainerProps> = ({ onClick, isActive, label = 'Export', tooltip, children }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const component = (
    <>
      {children || (
        <UploadButton icon={isActive ? 'publishSpin' : 'rocket'} id={Identifier.UPLOAD} onClick={onClick} isUploading={isActive}>
          {label}
        </UploadButton>
      )}
    </>
  );

  if (tooltip) {
    return (
      <TippyTooltip html={<Box width={180}>{tooltip}</Box>} position="bottom" disabled={!canEditCanvas}>
        {component}
      </TippyTooltip>
    );
  }

  return <div>{component}</div>;
};

export default UploadButtonContainer;
