import React from 'react';

import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

import { FOOTER_HEIGHT, sectionStyles } from '../styles';

const EditorFooter = ({ children, className }) => <div className={className}>{children}</div>;

export default styled(EditorFooter)`
  ${flexStyles}
  ${sectionStyles}

  min-height: ${FOOTER_HEIGHT}px;
  height: ${FOOTER_HEIGHT}px;
  background-color: #fff;
  z-index: 0;
`;
