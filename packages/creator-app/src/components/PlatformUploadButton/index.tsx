import { Box, Button, Icon, PrimaryButtonIcon, PrimaryButtonLabel, PrimaryButtonProps, SvgIconContainer, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { css, styled } from '@/hocs';
import { usePermission } from '@/hooks';
import { Spin } from '@/styles/animations';
import { Identifier } from '@/styles/constants';

export interface UploadButtonProps extends PrimaryButtonProps {
  isVendors?: boolean;
  isUploading?: boolean;
}

const UploadButton = styled(Button).attrs({ speed: 2000 })<UploadButtonProps>`
  ${({ isVendors }) =>
    isVendors &&
    css`
      min-width: 135px;
    `}

  ${({ isUploading }) =>
    isUploading &&
    css`
      box-shadow: none;
    `}

  ${PrimaryButtonIcon} {
    box-shadow: none;

    ${SvgIconContainer} {
      display: block;
      opacity: 1;
      ${({ isUploading }) => isUploading && Spin}
    }
  }

  ${PrimaryButtonLabel} {
    padding-right: 20px;
    text-align: left;
  }
`;

interface UploadButtonContainerProps {
  icon?: Icon;
  label?: string;
  onClick: React.MouseEventHandler;
  tooltip?: string;
  isActive: boolean;
}

const UploadButtonContainer: React.FC<UploadButtonContainerProps> = ({ icon = 'rocket', onClick, isActive, label = 'Export', tooltip, children }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const component = (
    <>
      {children || (
        <UploadButton id={Identifier.UPLOAD} icon={isActive ? 'publishSpin' : icon} onClick={onClick} isUploading={isActive}>
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
