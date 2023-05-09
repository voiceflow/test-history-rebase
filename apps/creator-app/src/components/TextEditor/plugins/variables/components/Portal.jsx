import React from 'react';

import { styled } from '@/hocs/styled';

const Text = styled.span`
  color: #132144;
  font-weight: 600;
`;

export default React.forwardRef(({ children }, ref) => <Text ref={ref}>{children}</Text>);
