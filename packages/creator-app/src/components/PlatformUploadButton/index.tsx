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
      background-color: rgba(93, 157, 245, 0.3);

      :hover {
        background-color: rgba(93, 157, 245, 0.3);
      }
    `}

  ${PrimaryButtonIcon} {
    box-shadow: none;
    ${({ isUploading }) =>
      isUploading &&
      `
      background-color: #3d82e2;

      :hover {
        background-color: #3d82e2;
      }
    `};

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

interface UploadButtonContainerProps extends PrimaryButtonProps {
  icon?: Icon;
  label?: string;
  onClick: React.MouseEventHandler;
  tooltip?: string;
  isActive: boolean;
}

const UploadButtonContainer: React.FC<UploadButtonContainerProps> = ({
  icon = 'rocket',
  onClick,
  isActive,
  label = 'Export',
  tooltip,
  children,
  ...props
}) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const component = (
    <>
      {children || (
        <UploadButton id={Identifier.UPLOAD} icon={isActive ? 'publishSpin' : icon} onClick={onClick} isUploading={isActive} {...props}>
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
