import React from 'react';

import { styled } from '@/hocs';

const Text = styled.span`
  color: #f00;
`;

// eslint-disable-next-line react/display-name
export default React.forwardRef(({ children }, ref) => <Text ref={ref}>{children}</Text>);
