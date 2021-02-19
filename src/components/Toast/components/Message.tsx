import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import { styled } from '@/hocs';

const MessageWrapper = styled.div`
  display: flex;
  color: #132144;
`;

const MessageIcon = styled(SvgIcon)`
  padding-top: 4px;
  margin-right: 16px;
`;

export type MessageProps = React.PropsWithChildren<{
  icon?: Icon;
  iconColor?: string;
}>;

const Message: React.FC<MessageProps> = ({ icon, children, iconColor }) => (
  <MessageWrapper>
    {!!icon && <MessageIcon icon={icon} color={iconColor} size={16} />}
    <div>{children}</div>
  </MessageWrapper>
);

Message.propTypes = {
  icon: PropTypes.string as any,
  children: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
};

export default Message;
