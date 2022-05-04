import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import THEME from '@/styles/theme';

const CombinedEditor: NodeEditor<Realtime.NodeData.Combined> = ({ data: { nodeID } }) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const stepData = useSelector(CreatorV2.stepDataByBlockIDSelector, { id: nodeID });

  return (
    <Content>
      {stepData.map(({ nodeID, ...data }, index) => {
        const { getIcon, icon, label } = getManager(data.type);

        const svgIcon = getIcon?.(data as any) || icon;

        return (
          <Section
            key={nodeID}
            prefix={svgIcon ? <SvgIcon icon={svgIcon} color={THEME.buttonIconColors.default} /> : null}
            header={data.name || label}
            isLink
            onClick={() => engine.setActive(nodeID)}
            headerVariant={HeaderVariant.LINK}
            isDividerNested={index !== 0}
          />
        );
      })}
    </Content>
  );
};

export default CombinedEditor;
