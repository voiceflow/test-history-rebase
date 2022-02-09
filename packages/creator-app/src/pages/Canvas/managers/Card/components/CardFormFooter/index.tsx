import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpMessage from './HelpMessage';
import HelpTooltip from './HelpTooltip';

interface CardFormFooterProps {
  data: Realtime.NodeData<Realtime.NodeData.Card>;
  onChange: (data: Partial<Realtime.NodeData.Card>) => void;
  isStandard?: boolean;
}

const CardFormFooter: React.FC<CardFormFooterProps> = ({ isStandard, onChange, data }) => {
  const tutorial = {
    content: <HelpTooltip />,
    helpMessage: <HelpMessage />,
    blockType: data.type,
    helpTitle: 'Having trouble?',
  };

  if (!isStandard) {
    return <Controls tutorial={tutorial} />;
  }

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
};

export default CardFormFooter;
