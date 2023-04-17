import { Box, Button, Flex, PrimaryButton, PrimaryButtonProps, SvgIcon, SvgIconTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { css, styled } from '@/hocs/styled';
import { usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { PlatformUploadButtonLabel } from './components';

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

  ${PrimaryButton.Icon} {
    box-shadow: none;
    color: #ffffff !important;
    ${({ isUploading }) =>
      isUploading &&
      `
      :hover {
        background-color: #3d82e2;
      }
    `};
  }
`;

interface UploadButtonContainerProps extends Partial<PrimaryButtonProps> {
  icon?: SvgIconTypes.Icon;
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
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const component = (
    <>
      {children || (
        <UploadButton id={Identifier.UPLOAD} onClick={onClick} isUploading={isActive} squareRadius {...props}>
          <Flex>
            <SvgIcon icon={icon} size={16} spin={isActive} color="#ffffff" />
            <PlatformUploadButtonLabel>{label}</PlatformUploadButtonLabel>
          </Flex>
        </UploadButton>
      )}
    </>
  );

  if (tooltip) {
    return (
      <TippyTooltip content={<Box width={180}>{tooltip}</Box>} placement="bottom" disabled={!canEditCanvas}>
        {component}
      </TippyTooltip>
    );
  }

  return <div>{component}</div>;
};

export default UploadButtonContainer;
