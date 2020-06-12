import React from 'react';

import Tooltip from '@/components/TippyTooltip';
import { styled } from '@/hocs';

const Container = styled.div`
  margin-bottom: 16px;
`;

type MarkupButtonProps = {
  title: string;
  children: any;
};

const MarkupMenuButtonContainer: React.FC<MarkupButtonProps> = ({ title, children }) => {
  return (
    <Container>
      <Tooltip distance={6} title={title} position="right">
        {children}
      </Tooltip>
    </Container>
  );
};

export default MarkupMenuButtonContainer;
