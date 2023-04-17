import { flexStyles } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

import { FOOTER_HEIGHT, sectionStyles } from '../styles';

const EditorFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export default styled(EditorFooter)`
  ${flexStyles}
  ${sectionStyles}
  z-index: 0;
  height: ${FOOTER_HEIGHT}px;
  min-height: ${FOOTER_HEIGHT}px;
  background-color: #fff;
`;
