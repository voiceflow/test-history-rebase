import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { colors, styled, ThemeColor } from '@ui/styles';
import React from 'react';

const MessageWrapper = styled.div`
  display: flex;
  color: ${colors(ThemeColor.PRIMARY)};
`;

const MessageIcon = styled(SvgIcon)`
  margin-right: 16px;
  padding-top: 4px;
`;

export interface MessageProps {
  icon?: SvgIconTypes.Icon;
  children?: React.ReactNode;
  iconColor?: string;
}

const Message: React.FC<MessageProps> = ({ icon, children, iconColor }) => (
  <MessageWrapper>
    {!!icon && <MessageIcon icon={icon} color={iconColor} size={16} />}
    <div>{children}</div>
  </MessageWrapper>
);

export default Message;
