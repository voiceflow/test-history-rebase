import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { BlockType } from '@/constants';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

interface FooterProps {
  onEdit: VoidFunction;
  editable: boolean;
  blockType: BlockType;
  hasVariableMapping: boolean;
  addVariableMapping: VoidFunction;
  clearVariableMapping: VoidFunction;
}

const Footer: React.FC<FooterProps> = ({ onEdit, editable, blockType, hasVariableMapping, addVariableMapping, clearVariableMapping }) => (
  <Controls
    menu={
      editable ? (
        <OverflowMenu
          options={[
            {
              label: hasVariableMapping ? 'Cancel Mapping' : 'Variable Mapping',
              onClick: hasVariableMapping ? clearVariableMapping : addVariableMapping,
            },
          ]}
        />
      ) : null
    }
    options={[
      {
        label: 'Edit',
        onClick: onEdit,
        variant: ButtonVariant.PRIMARY,
        disabled: !editable,
      },
    ]}
    anchor="How it Works?"
    tutorial={{ content: <HelpTooltip />, blockType }}
    tutorialTitle="Component Tutorial"
  />
);

export default Footer;
