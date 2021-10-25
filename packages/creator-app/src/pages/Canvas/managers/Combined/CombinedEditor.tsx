import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { NodeData } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const CombinedEditor: NodeEditor<NodeData.Combined> = ({ data: { nodeID } }) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const getNodeByID = useSelector(Creator.nodeByIDSelector);
  const getDataByNodeID = useSelector(Creator.dataByNodeIDSelector);

  const nestedBlocks = React.useMemo(() => {
    const { combinedNodes } = getNodeByID(nodeID) ?? { combinedNodes: [] };

    return combinedNodes.map((nodeID) => getDataByNodeID(nodeID));
  }, [nodeID, getNodeByID, getDataByNodeID]);

  return (
    <Content>
      {nestedBlocks.map(({ nodeID, ...data }, index) => {
        const { getIcon, getIconColor, icon, iconColor, label } = getManager(data.type);

        const svgIcon = getIcon?.(data) || icon;

        return (
          <Section
            key={nodeID}
            prefix={svgIcon ? <SvgIcon icon={svgIcon} color={getIconColor?.(data) || iconColor} /> : null}
            header={data.name || label}
            isLink
            onClick={() => engine.focus.set(nodeID)}
            headerVariant={HeaderVariant.LINK}
            isDividerNested={index !== 0}
          />
        );
      })}
    </Content>
  );
};

export default CombinedEditor;
