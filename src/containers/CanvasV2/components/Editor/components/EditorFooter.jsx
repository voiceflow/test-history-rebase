import React from 'react';

import { flexStyles } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

import { FOOTER_HEIGHT, sectionStyles } from '../styles';

const EditorFooter = ({ children, className }) => <div className={className}>{children}</div>;

export default styled(EditorFooter)`
  ${flexStyles}
  ${sectionStyles}

  height: ${FOOTER_HEIGHT}px;
`;
