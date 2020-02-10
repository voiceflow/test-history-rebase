import React from 'react';

import OverflowMenu from '@/componentsV2/OverflowMenu';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

function Footer({ diagram, hasVariableMapping, emptyMapping, startMapping, goToDiagram, blockType }) {
  return (
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
          variant: 'primary',
          disabled: !diagram,
        },
      ]}
      tutorial={{
        content: <HelpTooltip />,
        blockType,
        tutorialTitle: 'Flow Block Tutorial',
      }}
      anchor="What are flows?"
    ></Controls>
  );
}

export default Footer;
