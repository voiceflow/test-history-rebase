import React from 'react';

import { styled } from '@/hocs/styled';

const Text = styled.span`
  color: #132144;
  font-weight: 600;
`;

// eslint-disable-next-line react/display-name
export default React.forwardRef(({ children }, ref) => <Text ref={ref}>{children}</Text>);
