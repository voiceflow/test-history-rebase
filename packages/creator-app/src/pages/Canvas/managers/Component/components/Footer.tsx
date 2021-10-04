import { Diagram } from '@voiceflow/realtime-sdk';
import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { BlockType } from '@/constants';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

interface FooterProps {
  diagram: Diagram | null;
  hasVariableMapping: boolean;
  emptyMapping: () => void;
  startMapping: () => void;
  goToDiagram: () => Promise<void>;
  blockType: BlockType;
}

const Footer: React.FC<FooterProps> = ({ diagram, hasVariableMapping, emptyMapping, startMapping, goToDiagram, blockType }) => (
  <Controls
    menu={
      diagram ? (
        <OverflowMenu
          options={[
            {
              label: hasVariableMapping ? 'Cancel Mapping' : 'Variable Mapping',
              onClick: hasVariableMapping ? emptyMapping : startMapping,
            },
          ]}
        />
      ) : null
    }
    options={[
      {
        label: 'Edit',
        onClick: goToDiagram,
        variant: ButtonVariant.PRIMARY,
        disabled: !diagram,
      },
    ]}
    tutorial={{
      content: <HelpTooltip />,
      blockType,
    }}
    anchor="How it Works?"
  />
);

export default Footer;
