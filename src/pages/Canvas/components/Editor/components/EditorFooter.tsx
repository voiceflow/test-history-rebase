import React from 'react';

import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

import { FOOTER_HEIGHT, sectionStyles } from '../styles';

const EditorFooter: React.FC<{ className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;

export default styled(EditorFooter)`
  ${flexStyles}
  ${sectionStyles}
  z-index: 0;
  height: ${FOOTER_HEIGHT}px;
  min-height: ${FOOTER_HEIGHT}px;
  background-color: #fff;
`;
