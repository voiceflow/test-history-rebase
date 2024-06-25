import { COLOR_PICKER_CONSTANTS, setRef } from '@voiceflow/ui';
import React from 'react';

import { useActiveProjectConfig } from '@/hooks';
import { ChipAPIProvider } from '@/pages/Canvas/components/Chip';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import type { CombinedAPI } from '@/pages/Canvas/types';

import { useCombined } from './hooks';
import { useChipApi, useChipStepAPI } from './NodeChipStep/hooks';
import NodeLifecycle from './NodeLifecycle';
import Styles from './NodeStepStyles';

const { ColorScheme, DEFAULT_SCHEME_COLORS } = COLOR_PICKER_CONSTANTS;

const NodeChipStart = React.forwardRef<CombinedAPI>((_, ref) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext);

  const { nlu, platform, projectType } = useActiveProjectConfig();

  const chipElmRef = React.useRef<HTMLElement>(null);

  const {
    palette,
    onClick,
    onDropRef,
    nodeEntity,
    isHovered,
    wrapElement,
    combinedRef,
    hoverHandlers,
    hasLinkWarning,
  } = useCombined({
    defaultBlockColor: DEFAULT_SCHEME_COLORS[ColorScheme.BLACK].standardColor,
  });

  const onRename = React.useCallback(
    (label: string) => engine.node.updateData(nodeEntity.nodeID, { label }),
    [engine, nodeEntity.nodeID]
  );

  const { data, ports } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve();

    return {
      data,
      ports: node.ports,
    };
  });

  const chipApi = useChipApi(chipElmRef);
  const chipStepApi = useChipStepAPI({
    ...hoverHandlers,
    ref: chipElmRef,
    name: (data as any).label,
    apiRef: chipApi.apiRef,
    nodeID: nodeEntity.nodeID,
    palette,
    onClick,
    onRename,
  });

  React.useImperativeHandle(ref, () => chipApi, []);

  React.useLayoutEffect(() => {
    setRef(combinedRef, chipApi);
    onDropRef(chipApi);

    return () => {
      setRef(combinedRef, null);
      onDropRef(null);
    };
  }, [onDropRef]);

  const { chip: Chip } = getManager?.(nodeEntity.nodeType) ?? {};

  if (!Chip) return null;

  return wrapElement(
    <>
      <Styles isHovered={isHovered} hasLinkWarning={hasLinkWarning} />
      <NodeLifecycle />

      <ChipAPIProvider value={chipStepApi}>
        <Chip
          data={data as any}
          ports={ports as any}
          engine={engine}
          nluType={nlu}
          platform={platform}
          projectType={projectType}
        />
      </ChipAPIProvider>
    </>
  );
});

export default NodeChipStart;
