import * as Realtime from '@realtime-sdk';
import { ButtonVariant } from '@ui';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

interface FooterProps {
  diagram: Realtime.Diagram | null;
  blockType: Realtime.BlockType;
  hasVariableMapping: boolean;
  emptyMapping: VoidFunction;
  startMapping: VoidFunction;
  goToDiagram: VoidFunction;
}

const Footer: React.FC<FooterProps> = ({ diagram, blockType, hasVariableMapping, emptyMapping, startMapping, goToDiagram }) => (
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
        label: 'Enter Flow',
        onClick: goToDiagram,
        variant: ButtonVariant.PRIMARY,
        disabled: !diagram,
      },
    ]}
    tutorialTitle="Flow Block Tutorial"
    tutorial={{
      content: <HelpTooltip />,
      blockType,
    }}
    anchor="What are flows?"
  />
);

export default Footer;
