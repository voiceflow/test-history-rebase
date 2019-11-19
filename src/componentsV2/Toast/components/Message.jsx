import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const Wrapper = styled.div`
  display: flex;
  color: #132144;
`;

const Icon = styled(SvgIcon)`
  padding-top: 2px;
  margin-right: 16px;
`;

export default function Message({ icon, children, iconColor }) {
  return (
    <Wrapper>
      {!!icon && <Icon icon={icon} color={iconColor} size={16} />}
      <div>{children}</div>
    </Wrapper>
  );
}

Message.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired,
};
