import React from 'react';
import styled from 'styled-components';

import LegacyButton from '@/components/Button';

import Section from './BlockEditorSection';

const BlockEditorRemovableSection = ({ children, onClose, ...props }) => (
  <Section {...props}>
    {onClose && <LegacyButton isClose onClick={onClose} />}
    {children}
  </Section>
);

export default styled(BlockEditorRemovableSection)`
  position: relative;

  & > button.close {
    position: absolute;
    top: 22px;
    right: 22px;
    width: 14px;
    margin: 0 !important;
  }
`;
