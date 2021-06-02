import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpMessage from './HelpMessage';
import HelpTooltip from './HelpTooltip';

export default function CardFormFooter({ isStandard, onChange, data }) {
  const tutorial = {
    content: <HelpTooltip />,
    helpMessage: <HelpMessage />,
    blockType: data.type,
    helpTitle: 'Having trouble?',
  };
  if (isStandard) {
    return (
      <Controls
        menu={
          <OverflowMenu
            placement="top-end"
            options={[
              {
                label: data.hasSmallImage ? 'Remove Small Image' : 'Add Small Screen Image',
                onClick: () => onChange({ hasSmallImage: !data.hasSmallImage, smallImage: '' }),
              },
            ]}
          />
        }
        tutorial={tutorial}
      />
    );
  }
  return <Controls tutorial={tutorial} />;
}
